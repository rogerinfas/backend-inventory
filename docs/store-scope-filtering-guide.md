# 🔐 Guía de Filtrado Automático por Tienda (Store Scope Filtering)

## 📖 Índice
1. [Introducción](#introducción)
2. [Conceptos Fundamentales](#conceptos-fundamentales)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Componentes Principales](#componentes-principales)
5. [Flujo de Ejecución](#flujo-de-ejecución)
6. [Implementación en Controllers](#implementación-en-controllers)
7. [Implementación en Use-Cases](#implementación-en-use-cases)
8. [Casos de Uso](#casos-de-uso)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)
11. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Introducción

### ¿Qué es el Store Scope Filtering?

El **Store Scope Filtering** es un sistema de seguridad y filtrado automático que garantiza que los usuarios solo puedan acceder a los recursos (productos, ventas, compras, clientes, etc.) que pertenecen a su tienda asignada, excepto los SUPERADMIN que tienen acceso completo a todas las tiendas.

### Objetivos

- ✅ **Seguridad Automática**: Filtrado a nivel de infraestructura sin depender del desarrollador
- ✅ **Separación por Roles**: Diferentes niveles de acceso según el rol del usuario
- ✅ **Transparente**: No requiere cambios en la lógica de negocio existente
- ✅ **Centralizado**: Toda la lógica en un solo lugar (Guard)
- ✅ **Type-Safe**: TypeScript valida todo en tiempo de compilación

### Comportamiento por Rol

| Rol | Acceso | Filtrado |
|-----|--------|----------|
| **SUPERADMIN** | 🌍 Todas las tiendas | ❌ Sin filtro - Ve todo |
| **ADMIN** | 🏪 Solo su tienda | ✅ Filtrado por `user.storeId` |
| **SELLER** | 🏪 Solo su tienda | ✅ Filtrado por `user.storeId` |

---

## 🧩 Conceptos Fundamentales

### 1. Value Object: StoreFilter

El `StoreFilter` es un Value Object que encapsula la información del filtro de tienda:

```typescript
// src/domain/value-objects/store-filter.vo.ts
export interface StoreFilter {
  storeId: string | null;  // null = SUPERADMIN (sin filtro)
  role: UserRole;          // Rol del usuario
  isSuperAdmin: boolean;   // Flag rápido para checks
}
```

### 2. Decorador: @StoreScoped()

Marca los endpoints que deben aplicar filtrado automático:

```typescript
// src/infrastructure/decorators/store-scoped.decorator.ts
export const STORE_SCOPED_KEY = 'isStoreScoped';
export const StoreScoped = () => SetMetadata(STORE_SCOPED_KEY, true);
```

### 3. Guard: StoreScopeGuard

Guard global que intercepta las peticiones y aplica el filtrado:

```typescript
// src/infrastructure/guards/store-scope.guard.ts
@Injectable()
export class StoreScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Verifica si tiene @StoreScoped()
    const isStoreScoped = this.reflector.getAllAndOverride<boolean>(
      STORE_SCOPED_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isStoreScoped) return true;

    const request = context.switchToHttp().getRequest();
    const user = request['user'] as AuthPayload;

    // Aplica filtro según el rol
    if (user.role === UserRole.SUPERADMIN) {
      request['storeFilter'] = {
        storeId: null,
        role: user.role,
        isSuperAdmin: true
      };
    } else {
      request['storeFilter'] = {
        storeId: user.storeId,
        role: user.role,
        isSuperAdmin: false
      };
    }

    return true;
  }
}
```

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP REQUEST                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  🛡️ GUARDS (Infrastructure Layer)                           │
│  ┌──────────────────┐  ┌──────────────────────────────────┐ │
│  │ JwtAuthGuard     │→ │ StoreScopeGuard                  │ │
│  │ (1° - Autentica) │  │ (2° - Filtra por tienda)         │ │
│  └──────────────────┘  └──────────────────────────────────┘ │
│                                ↓                            │
│                     request['storeFilter']                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  📡 CONTROLLERS (Infrastructure Layer)                      │
│  - Extrae storeFilter del request                           │
│  - Pasa al Service                                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  ⚙️ SERVICES (Application Layer)                            │
│  - Recibe storeFilter                                       │
│  - Pasa al Use-Case                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  💼 USE-CASES (Application Layer)                           │
│  - Aplica el filtro al repositorio                          │
│  - Si storeId !== null → Filtra                             │
│  - Si storeId === null → No filtra (SUPERADMIN)             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  🗄️ REPOSITORIES (Infrastructure Layer)                     │
│  - Ejecuta query con filtros                                │
└─────────────────────────────────────────────────────────────┘
```

### Configuración Global

```typescript
// src/app.module.ts
@Module({
  imports: [
    AuthModule,  // ⚠️ DEBE ser @Global()
    // ... otros módulos
  ],
  providers: [
    // El orden importa: primero auth, luego scope
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: StoreScopeGuard },
  ],
})
export class AppModule {}
```

```typescript
// src/infrastructure/modules/auth.module.ts
@Global()  // ⚠️ CRÍTICO: Hace que JwtModule esté disponible globalmente
@Module({
  imports: [JwtModule.register(...)],
  providers: [JwtAuthGuard, StoreScopeGuard],
  exports: [JwtAuthGuard, StoreScopeGuard, JwtModule],
})
export class AuthModule {}
```

---

## 🔧 Componentes Principales

### 1. Domain Layer

#### StoreFilter Value Object

```typescript
// src/domain/value-objects/store-filter.vo.ts
import { UserRole } from '../enums/user-role.enum';

export interface StoreFilter {
  storeId: string | null;
  role: UserRole;
  isSuperAdmin: boolean;
}
```

**Propósito**: Encapsular la información del filtro de manera type-safe.

### 2. Infrastructure Layer

#### Decorador @StoreScoped

```typescript
// src/infrastructure/decorators/store-scoped.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const STORE_SCOPED_KEY = 'isStoreScoped';
export const StoreScoped = () => SetMetadata(STORE_SCOPED_KEY, true);
```

**Propósito**: Marcar endpoints que requieren filtrado automático.

#### StoreScopeGuard

```typescript
// src/infrastructure/guards/store-scope.guard.ts
@Injectable()
export class StoreScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isStoreScoped = this.reflector.getAllAndOverride<boolean>(
      STORE_SCOPED_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isStoreScoped) return true;

    const request = context.switchToHttp().getRequest();
    const user = request['user'] as AuthPayload;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (user.role === UserRole.SUPERADMIN) {
      request['storeFilter'] = {
        storeId: null,
        role: user.role,
        isSuperAdmin: true
      };
    } else if (user.role === UserRole.ADMIN || user.role === UserRole.SELLER) {
      if (!user.storeId) {
        throw new ForbiddenException(
          'El usuario no tiene asignada una tienda'
        );
      }
      request['storeFilter'] = {
        storeId: user.storeId,
        role: user.role,
        isSuperAdmin: false
      };
    } else {
      throw new ForbiddenException('Rol de usuario no válido');
    }

    return true;
  }
}
```

**Propósito**: Interceptar peticiones y agregar `storeFilter` al request.

### 3. Application Layer

#### Service

```typescript
// src/application/services/product.service.ts
import type { StoreFilter } from '../../domain/value-objects';

@Injectable()
export class ProductService {
  async listProducts(
    query: ProductQueryDto,
    storeFilter?: StoreFilter  // ✅ Parámetro opcional
  ): Promise<ListProductsResult> {
    return this.listProductsUseCase.execute(query, storeFilter);
  }
}
```

#### Use-Case

```typescript
// src/application/use-cases/product/list-products.use-case.ts
import type { StoreFilter } from '../../../domain/value-objects';

@Injectable()
export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    query: ProductQueryDto,
    storeFilter?: StoreFilter
  ): Promise<ListProductsResult> {
    const filters = ProductMapper.toQueryFilters(query);
    
    // ✅ Aplicar filtro según el rol
    if (storeFilter && storeFilter.storeId) {
      filters.storeId = storeFilter.storeId;
    }
    
    const products = await this.productRepository.findMany(filters);
    // ... resto de la lógica
  }
}
```

---

## 🔄 Flujo de Ejecución

### Diagrama de Secuencia

```
┌────────┐    ┌──────────┐    ┌────────────┐    ┌────────────┐
│ Client │    │ JwtAuth  │    │ StoreScope │    │ Controller │
│        │    │  Guard   │    │   Guard    │    │            │
└────┬───┘    └─────┬────┘    └──────┬─────┘    └──────┬─────┘
     │              │                │                 │
     │ GET /products│                │                 │
     ├─────────────>│                │                 │
     │              │                │                 │
     │        ✅ Valida JWT          │                 │
     │        ├─────┐                │                 │
     │        │ OK  │                │                 │
     │        └─────┘                │                 │
     │              │                │                 │
     │        request['user'] = {...}│                 │
     │              │                │                 │
     │              ├───────────────>│                 │
     │              │                │                 │
     │              │          ✅ Verifica @StoreScoped│
     │              │          ├─────┐                 │
     │              │          │ YES │                 │
     │              │          └─────┘                 │
     │              │                │                 │
     │              │    if SUPERADMIN?               │
     │              │    request['storeFilter'] =     │
     │              │    { storeId: null, ... }       │
     │              │                                  │
     │              │    else (ADMIN/SELLER)?         │
     │              │    request['storeFilter'] =     │
     │              │    { storeId: user.storeId, ... }│
     │              │                │                 │
     │              │                ├────────────────>│
     │              │                │                 │
     │              │                │   ✅ Extrae    │
     │              │                │   storeFilter  │
     │              │                │   del request  │
     │              │                │   └─────┐      │
     │              │                │         │      │
     │              │                │   Llama Service│
     │              │                │         │      │
     │              │                │   Service →    │
     │              │                │   Use-Case →   │
     │              │                │   Repository   │
     │<───────────────────────────────────────────────┤
     │              │                │   Response     │
```

### Flujo Paso a Paso

1. **Cliente envía petición**
   ```http
   GET /products
   Authorization: Bearer eyJhbGc...
   ```

2. **JwtAuthGuard valida el token**
   - Extrae el token del header
   - Verifica el JWT
   - Agrega `user` al request:
     ```typescript
     request['user'] = {
       sub: "user-id",
       email: "admin@tienda-a.com",
       role: UserRole.ADMIN,
       storeId: "tienda-a-id"
     }
     ```

3. **StoreScopeGuard aplica filtrado**
   - Verifica si el endpoint tiene `@StoreScoped()`
   - Lee `request['user']`
   - Crea y agrega `storeFilter`:
     ```typescript
     // Para ADMIN/SELLER
     request['storeFilter'] = {
       storeId: "tienda-a-id",
       role: UserRole.ADMIN,
       isSuperAdmin: false
     }
     
     // Para SUPERADMIN
     request['storeFilter'] = {
       storeId: null,
       role: UserRole.SUPERADMIN,
       isSuperAdmin: true
     }
     ```

4. **Controller recibe la petición**
   ```typescript
   @Get()
   @StoreScoped()
   async listProducts(
     @Query() query: ProductQueryDto,
     @Req() request: Request
   ): Promise<ListProductsResult> {
     const storeFilter = request['storeFilter'] as StoreFilter;
     return this.productService.listProducts(query, storeFilter);
   }
   ```

5. **Service delega al Use-Case**
   ```typescript
   async listProducts(
     query: ProductQueryDto,
     storeFilter?: StoreFilter
   ): Promise<ListProductsResult> {
     return this.listProductsUseCase.execute(query, storeFilter);
   }
   ```

6. **Use-Case aplica el filtro**
   ```typescript
   async execute(
     query: ProductQueryDto,
     storeFilter?: StoreFilter
   ): Promise<ListProductsResult> {
     const filters = ProductMapper.toQueryFilters(query);
     
     // ✅ ADMIN/SELLER: Filtra por su tienda
     if (storeFilter && storeFilter.storeId) {
       filters.storeId = storeFilter.storeId;
     }
     // ✅ SUPERADMIN: No filtra (storeId = null)
     
     const products = await this.productRepository.findMany(filters);
     // ...
   }
   ```

---

## 📝 Implementación en Controllers

### Patrón Estándar

```typescript
import {
  Controller,
  Get,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import type { StoreFilter } from '../../domain/value-objects';
import { StoreScoped } from '../decorators';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ✅ CON filtrado automático
  @Get()
  @StoreScoped()  // 👈 Aplica el filtrado
  async listProducts(
    @Query() query: ProductQueryDto,
    @Req() request: Request  // 👈 Inyecta el request
  ): Promise<ListProductsResult> {
    const storeFilter = request['storeFilter'] as StoreFilter;
    return this.productService.listProducts(query, storeFilter);
  }

  // ✅ CON filtrado automático
  @Get(':id')
  @StoreScoped()  // 👈 Aplica el filtrado
  async getProductById(
    @Param('id') id: string,
    @Req() request: Request
  ): Promise<ProductResponseDto> {
    const storeFilter = request['storeFilter'] as StoreFilter;
    return this.productService.getProductById(id, storeFilter);
  }

  // ❌ SIN filtrado (endpoint de creación)
  @Post()
  async createProduct(
    @Body() dto: CreateProductDto
  ): Promise<ProductResponseDto> {
    // El storeId viene en el DTO
    return this.productService.createProduct(dto);
  }
}
```

### ⚠️ Imports Importantes

```typescript
// ✅ CORRECTO: import type
import type { Request } from 'express';
import type { StoreFilter } from '../../domain/value-objects';

// ❌ INCORRECTO: import normal (causa errores de compilación)
import { Request } from 'express';
```

**Razón**: TypeScript con `emitDecoratorMetadata` requiere `import type` para tipos que se usan en decoradores.

---

## 💼 Implementación en Use-Cases

### Patrón para List (Listar recursos)

```typescript
import type { StoreFilter } from '../../../domain/value-objects';

@Injectable()
export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    query: ProductQueryDto,
    storeFilter?: StoreFilter  // 👈 Parámetro opcional
  ): Promise<ListProductsResult> {
    const filters = ProductMapper.toQueryFilters(query);
    
    // ✅ Aplicar filtro de tienda
    if (storeFilter && storeFilter.storeId) {
      filters.storeId = storeFilter.storeId;
    }
    // Si storeId es null (SUPERADMIN), no se filtra
    
    const products = await this.productRepository.findMany(filters);
    const total = await this.productRepository.count(filters);

    // ... resto de la lógica
    return { data, total, page, limit, totalPages };
  }
}
```

### Patrón para Get (Obtener por ID)

```typescript
import { ForbiddenException } from '@nestjs/common';
import type { StoreFilter } from '../../../domain/value-objects';

@Injectable()
export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    id: string,
    storeFilter?: StoreFilter
  ): Promise<ProductResponseDto | null> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      return null;
    }

    // ✅ Validar que el recurso pertenece a la tienda del usuario
    if (storeFilter && storeFilter.storeId) {
      if (product.storeId !== storeFilter.storeId) {
        throw new ForbiddenException(
          'No tiene permisos para acceder a este producto'
        );
      }
    }

    return ProductMapper.toResponseDto(product);
  }
}
```

### Caso Especial: Store (Tienda)

Para el recurso `Store`, ADMIN solo debe ver **su propia tienda**:

```typescript
@Injectable()
export class ListStoresUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(
    query: StoreQueryDto,
    storeFilter?: StoreFilter
  ): Promise<ListStoresResult> {
    // ✅ ADMIN: Solo su tienda
    if (storeFilter && storeFilter.storeId) {
      const store = await this.storeRepository.findById(storeFilter.storeId);
      if (!store) {
        return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      }
      
      const data = [StoreMapper.toResponseDto(store)];
      return { data, total: 1, page: 1, limit: 1, totalPages: 1 };
    }
    
    // ✅ SUPERADMIN: Todas las tiendas
    const filters = StoreMapper.toQueryFilters(query);
    const stores = await this.storeRepository.findMany(filters);
    // ...
  }
}
```

---

## 🎯 Casos de Uso

### Recursos que DEBEN usar @StoreScoped

✅ **Productos** (`ProductController`)
✅ **Ventas** (`SaleController`)
✅ **Compras** (`PurchaseController`)
✅ **Clientes** (`CustomerController`)
✅ **Proveedores** (`SupplierController`)
✅ **Usuarios** (`UserController`) - ADMIN solo ve usuarios de su tienda
✅ **Tiendas** (`StoreController`) - ADMIN solo ve su tienda

### Recursos que NO deben usar @StoreScoped

❌ **Autenticación** (`AuthController`) - Login/Registro son públicos
❌ **Categorías** (`CategoryController`) - Categorías son universales
❌ **Marcas** (`BrandController`) - Marcas son universales
❌ **Personas** (`PersonController`) - Entidad base compartida

### Tabla de Referencia

| Controller | Endpoints con @StoreScoped | Razón |
|------------|---------------------------|-------|
| `ProductController` | `GET /products`, `GET /products/:id` | Productos por tienda |
| `SaleController` | `GET /sales`, `GET /sales/:id` | Ventas por tienda |
| `PurchaseController` | `GET /purchases`, `GET /purchases/:id` | Compras por tienda |
| `CustomerController` | `GET /customers`, `GET /customers/:id` | Clientes por tienda |
| `SupplierController` | `GET /suppliers`, `GET /suppliers/:id` | Proveedores por tienda |
| `UserController` | `GET /users`, `GET /users/:id` | Usuarios por tienda |
| `StoreController` | `GET /stores`, `GET /stores/:id`, `GET /stores/ruc/:ruc` | ADMIN ve solo su tienda |
| `CategoryController` | Ninguno | Categorías universales |
| `BrandController` | Ninguno | Marcas universales |
| `AuthController` | Ninguno | Autenticación pública |

---

## 🧪 Testing

### Unit Tests

#### Test del StoreScopeGuard

```typescript
describe('StoreScopeGuard', () => {
  let guard: StoreScopeGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new StoreScopeGuard(reflector);
  });

  it('debe permitir endpoints sin @StoreScoped', () => {
    const context = createMockExecutionContext(false);
    expect(guard.canActivate(context)).toBe(true);
  });

  it('debe agregar storeFilter para ADMIN', () => {
    const context = createMockExecutionContext(true, {
      sub: 'user-id',
      email: 'admin@test.com',
      role: UserRole.ADMIN,
      storeId: 'store-123'
    });

    guard.canActivate(context);

    const request = context.switchToHttp().getRequest();
    expect(request['storeFilter']).toEqual({
      storeId: 'store-123',
      role: UserRole.ADMIN,
      isSuperAdmin: false
    });
  });

  it('debe agregar storeFilter sin filtro para SUPERADMIN', () => {
    const context = createMockExecutionContext(true, {
      sub: 'superadmin-id',
      email: 'superadmin@test.com',
      role: UserRole.SUPERADMIN,
      storeId: null
    });

    guard.canActivate(context);

    const request = context.switchToHttp().getRequest();
    expect(request['storeFilter']).toEqual({
      storeId: null,
      role: UserRole.SUPERADMIN,
      isSuperAdmin: true
    });
  });
});
```

#### Test del Use-Case

```typescript
describe('ListProductsUseCase', () => {
  let useCase: ListProductsUseCase;
  let repository: MockType<ProductRepository>;

  beforeEach(() => {
    repository = {
      findMany: jest.fn(),
      count: jest.fn(),
    };
    useCase = new ListProductsUseCase(repository as any);
  });

  it('debe filtrar por storeId cuando es ADMIN', async () => {
    const query: ProductQueryDto = { page: 1, limit: 10 };
    const storeFilter: StoreFilter = {
      storeId: 'store-123',
      role: UserRole.ADMIN,
      isSuperAdmin: false
    };

    await useCase.execute(query, storeFilter);

    expect(repository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ storeId: 'store-123' })
    );
  });

  it('NO debe filtrar por storeId cuando es SUPERADMIN', async () => {
    const query: ProductQueryDto = { page: 1, limit: 10 };
    const storeFilter: StoreFilter = {
      storeId: null,
      role: UserRole.SUPERADMIN,
      isSuperAdmin: true
    };

    await useCase.execute(query, storeFilter);

    expect(repository.findMany).toHaveBeenCalledWith(
      expect.not.objectContaining({ storeId: expect.anything() })
    );
  });
});
```

### E2E Tests

```typescript
describe('Products (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let superadminToken: string;

  beforeAll(async () => {
    // Setup...
  });

  describe('GET /products', () => {
    it('ADMIN debe ver solo productos de su tienda', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.data.every(p => p.storeId === 'store-a')).toBe(true);
    });

    it('SUPERADMIN debe ver productos de todas las tiendas', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .set('Authorization', `Bearer ${superadminToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(5);
      const uniqueStores = [...new Set(response.body.data.map(p => p.storeId))];
      expect(uniqueStores.length).toBeGreaterThan(1);
    });
  });
});
```

---

## 🔍 Troubleshooting

### Problema 1: "Usuario no autenticado"

**Síntoma**: Error `ForbiddenException: Usuario no autenticado`

**Causa**: El `JwtAuthGuard` no está funcionando correctamente.

**Solución**:
```typescript
// Verifica que AuthModule sea @Global()
@Global()
@Module({
  imports: [JwtModule.register(...)],
  exports: [JwtModule, JwtAuthGuard, StoreScopeGuard],
})
export class AuthModule {}
```

### Problema 2: JwtService not found

**Síntoma**: Error durante la inyección de dependencias

**Causa**: `JwtModule` no está disponible globalmente.

**Solución**:
```typescript
// auth.module.ts debe exportar JwtModule
exports: [JwtModule, JwtAuthGuard, StoreScopeGuard]
```

### Problema 3: storeFilter es undefined

**Síntoma**: `request['storeFilter']` es `undefined` en el controller

**Causa**: Falta el decorador `@StoreScoped()` o el guard no se ejecutó.

**Solución**:
```typescript
// Verifica que el endpoint tenga el decorador
@Get()
@StoreScoped()  // 👈 Necesario
async list(@Req() request: Request) {
  const storeFilter = request['storeFilter']; // Ahora existe
}
```

### Problema 4: ADMIN ve recursos de otras tiendas

**Síntoma**: Un ADMIN puede ver productos/ventas de otras tiendas

**Causa**: El use-case no está aplicando el filtro correctamente.

**Solución**:
```typescript
// Verifica que el use-case aplique el filtro
async execute(query: QueryDto, storeFilter?: StoreFilter) {
  const filters = Mapper.toQueryFilters(query);
  
  // ✅ Debe estar este código
  if (storeFilter && storeFilter.storeId) {
    filters.storeId = storeFilter.storeId;
  }
  
  return await this.repository.findMany(filters);
}
```

### Problema 5: Error de compilación con Request

**Síntoma**: Error TypeScript `TS1272`

**Causa**: Import incorrecto de `Request`.

**Solución**:
```typescript
// ❌ Incorrecto
import { Request } from 'express';

// ✅ Correcto
import type { Request } from 'express';
```

---

## ✅ Mejores Prácticas

### 1. Usa @StoreScoped solo en endpoints de lectura

```typescript
// ✅ BIEN: GET endpoints
@Get()
@StoreScoped()
async list() { }

@Get(':id')
@StoreScoped()
async getById() { }

// ❌ MAL: POST/PUT/PATCH endpoints
@Post()
@StoreScoped()  // ❌ No necesario, el storeId viene en el DTO
async create() { }
```

### 2. Siempre valida permisos en Get por ID

```typescript
async execute(id: string, storeFilter?: StoreFilter) {
  const entity = await this.repository.findById(id);
  
  if (!entity) return null;

  // ✅ IMPORTANTE: Validar pertenencia a la tienda
  if (storeFilter && storeFilter.storeId) {
    if (entity.storeId !== storeFilter.storeId) {
      throw new ForbiddenException('No tiene permisos');
    }
  }

  return mapper.toDto(entity);
}
```

### 3. Usa import type para tipos

```typescript
// ✅ SIEMPRE usa "import type"
import type { Request } from 'express';
import type { StoreFilter } from '../../domain/value-objects';
```

### 4. Documenta endpoints en Swagger

```typescript
@Get()
@StoreScoped()
@ApiOperation({
  summary: 'Listar productos',
  description: 'SUPERADMIN ve todos, ADMIN/SELLER solo de su tienda'
})
async list() { }
```

### 5. Testea ambos escenarios (ADMIN y SUPERADMIN)

```typescript
describe('ListProducts', () => {
  it('ADMIN ve solo su tienda', () => { });
  it('SUPERADMIN ve todas las tiendas', () => { });
});
```

### 6. Maneja el caso de storeFilter opcional

```typescript
// ✅ BIEN: Maneja storeFilter como opcional
async execute(query: Dto, storeFilter?: StoreFilter) {
  const filters = toFilters(query);
  
  if (storeFilter && storeFilter.storeId) {
    filters.storeId = storeFilter.storeId;
  }
  
  // ...
}
```

### 7. No filtres recursos universales

```typescript
// ❌ MAL: Categorías son universales
@Get()
@StoreScoped()  // ❌ No aplicar aquí
async listCategories() { }

// ✅ BIEN: Sin filtro
@Get()
async listCategories() { }
```

---

## 📚 Referencias

- **Clean Architecture**: Robert C. Martin
- **NestJS Guards**: [https://docs.nestjs.com/guards](https://docs.nestjs.com/guards)
- **TypeScript Decorators**: [https://www.typescriptlang.org/docs/handbook/decorators.html](https://www.typescriptlang.org/docs/handbook/decorators.html)

---

## 📝 Notas Finales

- ⚠️ El `AuthModule` **DEBE** ser `@Global()` para que funcione correctamente
- ⚠️ El orden de los guards importa: primero `JwtAuthGuard`, luego `StoreScopeGuard`
- ⚠️ Siempre usa `import type` para `Request` y `StoreFilter`
- ⚠️ Valida permisos en endpoints de obtener por ID
- ⚠️ No apliques `@StoreScoped` en endpoints de creación/actualización

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0  
**Autor**: Backend Team

