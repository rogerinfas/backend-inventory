# 🚨 Guía de Errores de Dominio (Domain Errors)

## 📖 Índice
1. [Introducción](#introducción)
2. [Arquitectura de Errores](#arquitectura-de-errores)
3. [Errores de Dominio Disponibles](#errores-de-dominio-disponibles)
4. [Cómo Crear Nuevos Errores](#cómo-crear-nuevos-errores)
5. [Manejo Global de Errores](#manejo-global-de-errores)
6. [Ejemplos de Respuestas HTTP](#ejemplos-de-respuestas-http)
7. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Introducción

### ¿Por qué Errores de Dominio?

En **Clean Architecture**, las reglas de negocio (capa de Application/Domain) **NO deben depender** de frameworks externos como NestJS. Por eso, en lugar de usar `HttpException`, `BadRequestException`, `ForbiddenException`, etc., creamos **errores de dominio propios**.

### Principios Fundamentales

1. ✅ **Independencia del Framework**: Los use-cases no conocen sobre HTTP
2. ✅ **Testabilidad**: Se pueden probar sin inicializar NestJS
3. ✅ **Semántica Clara**: Cada error tiene un significado de negocio específico
4. ✅ **Trazabilidad**: Códigos de error únicos para debugging
5. ✅ **Respuestas Consistentes**: Formato estandarizado en toda la API

---

## 🏗️ Arquitectura de Errores

### Jerarquía de Clases

```
DomainError (abstract)
│
├── PersonNotFoundError
├── PersonAlreadyExistsError
├── InvalidDocumentError
├── InvalidEmailError
├── InvalidPhoneError
├── PersonDeletedError
├── InvalidStatusChangeError
│
├── StoreNotFoundError
├── StoreAlreadyExistsError
├── StoreDeletedError
├── InvalidRucError
│
├── CustomerNotFoundError
├── CustomerAlreadyExistsError
├── CustomerDeletedError
│
├── SupplierNotFoundError
├── SupplierAlreadyExistsError
├── SupplierDeletedError
│
├── UserNotFoundError
├── UserAlreadyExistsError
├── UserDeletedError
├── InvalidPasswordError
│
├── UnauthorizedError
├── ForbiddenError
├── ResourceAccessDeniedError ⭐ (Store Filtering)
├── StoreAccessDeniedError ⭐ (Store Filtering)
│
├── CategoryNotFoundError
├── CategoryAlreadyExistsError
├── CategoryDeletedError
│
├── BrandNotFoundError
├── BrandAlreadyExistsError
├── BrandDeletedError
│
├── VoucherSeriesNotFoundError
├── VoucherSeriesAlreadyExistsError
│
├── SunatConfigNotFoundError
├── SunatConfigAlreadyExistsError
├── InvalidSunatCredentialsError
├── InvalidSunatEnvironmentError
│
├── ProductNotFoundError
├── ProductAlreadyExistsError
├── ProductDeletedError
├── InvalidSkuError
├── InvalidPriceError
├── InvalidStockError
├── InsufficientStockError
├── ProductInactiveError
│
├── PurchaseNotFoundError
├── PurchaseAlreadyExistsError
├── PurchaseCancelledError
├── PurchaseReceivedError
├── InvalidPurchaseAmountError
├── FutureDateError
├── PurchaseCreationError
├── InvalidPurchaseDetailQuantityError
├── InvalidPurchaseDetailPriceError
│
├── SaleNotFoundError
├── SaleAlreadyExistsError
├── SaleCancelledError
├── SaleCompletedError
├── SaleAlreadyCompletedError
├── SaleNotPendingError
└── SaleRefundError
```

### Clase Base: DomainError

```typescript
// src/application/errors/domain-errors.ts
export abstract class DomainError extends Error {
  abstract readonly code: string;        // Código único del error
  abstract readonly statusCode: number;  // HTTP status code
  abstract readonly isOperational: boolean; // ¿Es un error esperado?

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

**Propiedades**:
- `code`: Identificador único para el frontend/logs (ej: `PRODUCT_NOT_FOUND`)
- `statusCode`: Código HTTP que se retornará (404, 400, 403, etc.)
- `isOperational`: `true` = error esperado, `false` = error crítico del servidor
- `message`: Mensaje descriptivo en español para el usuario

---

## 📋 Errores de Dominio Disponibles

### Errores de Autenticación y Autorización (401, 403)

| Error | Código | Status | Uso |
|-------|--------|--------|-----|
| `UnauthorizedError` | `UNAUTHORIZED` | 401 | Credenciales inválidas, token expirado |
| `ForbiddenError` | `FORBIDDEN` | 403 | Usuario autenticado pero sin permisos |
| `ResourceAccessDeniedError` | `RESOURCE_ACCESS_DENIED` | 403 | Intento de acceder a recurso de otra tienda |
| `StoreAccessDeniedError` | `STORE_ACCESS_DENIED` | 403 | Igual al anterior pero con más detalles |

### Errores Not Found (404)

| Error | Código | Uso |
|-------|--------|-----|
| `PersonNotFoundError` | `PERSON_NOT_FOUND` | Persona no existe |
| `StoreNotFoundError` | `STORE_NOT_FOUND` | Tienda no existe |
| `CustomerNotFoundError` | `CUSTOMER_NOT_FOUND` | Cliente no existe |
| `SupplierNotFoundError` | `SUPPLIER_NOT_FOUND` | Proveedor no existe |
| `UserNotFoundError` | `USER_NOT_FOUND` | Usuario no existe |
| `CategoryNotFoundError` | `CATEGORY_NOT_FOUND` | Categoría no existe |
| `BrandNotFoundError` | `BRAND_NOT_FOUND` | Marca no existe |
| `ProductNotFoundError` | `PRODUCT_NOT_FOUND` | Producto no existe |
| `PurchaseNotFoundError` | `PURCHASE_NOT_FOUND` | Compra no existe |
| `SaleNotFoundError` | `SALE_NOT_FOUND` | Venta no existe |
| `VoucherSeriesNotFoundError` | `VOUCHER_SERIES_NOT_FOUND` | Serie no existe |
| `SunatConfigNotFoundError` | `SUNAT_CONFIG_NOT_FOUND` | Config SUNAT no existe |

### Errores Already Exists (409 - Conflict)

| Error | Código | Uso |
|-------|--------|-----|
| `PersonAlreadyExistsError` | `PERSON_ALREADY_EXISTS` | DNI/RUC duplicado |
| `StoreAlreadyExistsError` | `STORE_ALREADY_EXISTS` | RUC de tienda duplicado |
| `CustomerAlreadyExistsError` | `CUSTOMER_ALREADY_EXISTS` | Cliente ya existe para esa tienda |
| `SupplierAlreadyExistsError` | `SUPPLIER_ALREADY_EXISTS` | Proveedor ya existe para esa tienda |
| `UserAlreadyExistsError` | `USER_ALREADY_EXISTS` | Email duplicado |
| `CategoryAlreadyExistsError` | `CATEGORY_ALREADY_EXISTS` | Nombre de categoría duplicado |
| `BrandAlreadyExistsError` | `BRAND_ALREADY_EXISTS` | Nombre de marca duplicado |
| `ProductAlreadyExistsError` | `PRODUCT_ALREADY_EXISTS` | SKU duplicado |
| `PurchaseAlreadyExistsError` | `PURCHASE_ALREADY_EXISTS` | Nro. documento de compra duplicado |
| `SaleAlreadyExistsError` | `SALE_ALREADY_EXISTS` | Nro. documento de venta duplicado |
| `VoucherSeriesAlreadyExistsError` | `VOUCHER_SERIES_ALREADY_EXISTS` | Serie duplicada |
| `SunatConfigAlreadyExistsError` | `SUNAT_CONFIG_ALREADY_EXISTS` | Ya hay config para esa tienda |

### Errores de Validación (400 - Bad Request)

| Error | Código | Uso |
|-------|--------|-----|
| `InvalidDocumentError` | `INVALID_DOCUMENT` | DNI/RUC con formato inválido |
| `InvalidEmailError` | `INVALID_EMAIL` | Email con formato inválido |
| `InvalidPhoneError` | `INVALID_PHONE` | Teléfono con formato inválido |
| `InvalidRucError` | `INVALID_RUC` | RUC no tiene 11 dígitos |
| `InvalidPasswordError` | `INVALID_PASSWORD` | Contraseña no cumple requisitos |
| `InvalidSkuError` | `INVALID_SKU` | SKU con formato inválido |
| `InvalidPriceError` | `INVALID_PRICE` | Precio negativo o cero |
| `InvalidStockError` | `INVALID_STOCK` | Stock negativo |
| `InsufficientStockError` | `INSUFFICIENT_STOCK` | No hay stock suficiente para la venta |
| `InvalidPurchaseAmountError` | `INVALID_PURCHASE_AMOUNT` | Monto de compra inválido |
| `InvalidPurchaseDetailQuantityError` | `INVALID_PURCHASE_DETAIL_QUANTITY` | Cantidad inválida en detalle |
| `InvalidPurchaseDetailPriceError` | `INVALID_PURCHASE_DETAIL_PRICE` | Precio inválido en detalle |
| `FutureDateError` | `FUTURE_DATE_ERROR` | Fecha no puede ser futura |
| `InvalidStatusChangeError` | `INVALID_STATUS_CHANGE` | Cambio de estado no permitido |
| `InvalidSunatCredentialsError` | `INVALID_SUNAT_CREDENTIALS` | Credenciales SUNAT incorrectas |
| `InvalidSunatEnvironmentError` | `INVALID_SUNAT_ENVIRONMENT` | Ambiente SUNAT inválido |

### Errores de Estado (400, 410)

| Error | Código | Status | Uso |
|-------|--------|--------|-----|
| `PersonDeletedError` | `PERSON_DELETED` | 410 | Operación sobre persona eliminada |
| `StoreDeletedError` | `STORE_DELETED` | 410 | Operación sobre tienda eliminada |
| `CustomerDeletedError` | `CUSTOMER_DELETED` | 410 | Operación sobre cliente eliminado |
| `SupplierDeletedError` | `SUPPLIER_DELETED` | 410 | Operación sobre proveedor eliminado |
| `UserDeletedError` | `USER_DELETED` | 410 | Operación sobre usuario eliminado |
| `CategoryDeletedError` | `CATEGORY_DELETED` | 410 | Operación sobre categoría eliminada |
| `BrandDeletedError` | `BRAND_DELETED` | 410 | Operación sobre marca eliminada |
| `ProductDeletedError` | `PRODUCT_DELETED` | 410 | Operación sobre producto eliminado |
| `ProductInactiveError` | `PRODUCT_INACTIVE` | 400 | Operación sobre producto inactivo |
| `PurchaseCancelledError` | `PURCHASE_CANCELLED` | 400 | Operación sobre compra cancelada |
| `PurchaseReceivedError` | `PURCHASE_RECEIVED` | 400 | Compra ya recibida |
| `SaleCancelledError` | `SALE_CANCELLED` | 400 | Operación sobre venta cancelada |
| `SaleCompletedError` | `SALE_COMPLETED` | 400 | Venta ya completada |
| `SaleAlreadyCompletedError` | `SALE_ALREADY_COMPLETED` | 400 | Venta ya completada |
| `SaleNotPendingError` | `SALE_NOT_PENDING` | 400 | Venta no está en estado pendiente |
| `SaleRefundError` | `SALE_REFUND_ERROR` | 400 | Error al procesar devolución |

### Errores de Servidor (500)

| Error | Código | Status | Uso |
|-------|--------|--------|-----|
| `PurchaseCreationError` | `PURCHASE_CREATION_ERROR` | 500 | Error crítico al crear compra |

---

## 🛠️ Cómo Crear Nuevos Errores

### Paso 1: Definir el Error en domain-errors.ts

```typescript
// src/application/errors/domain-errors.ts

export class MiNuevoError extends DomainError {
  readonly code = 'MI_NUEVO_ERROR_CODE'; // Nombre en SCREAMING_SNAKE_CASE
  readonly statusCode = 400; // HTTP status apropiado
  readonly isOperational = true; // true = esperado, false = crítico

  constructor(parametros: string) {
    super(`Mensaje descriptivo con ${parametros}`);
  }
}
```

### Paso 2: Exportar desde index.ts (si es necesario)

```typescript
// src/application/errors/index.ts
export * from './domain-errors';
```

### Paso 3: Usar en Use-Cases

```typescript
// src/application/use-cases/mi-entidad/mi-use-case.ts
import { MiNuevoError } from '../../errors/domain-errors';

export class MiUseCase {
  async execute(data: any) {
    if (!validacion) {
      throw new MiNuevoError('valor');
    }
  }
}
```

---

## 🌐 Manejo Global de Errores

### GlobalExceptionFilter

Todos los errores de dominio son interceptados automáticamente:

```typescript
// src/infrastructure/filters/global-exception.filter.ts
import { DomainError } from '../../application/errors';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof DomainError) {
      // ✅ Automáticamente convierte a respuesta HTTP
      response.status(exception.statusCode).json({
        code: exception.code,
        message: exception.message,
        statusCode: exception.statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        isOperational: exception.isOperational,
      });
    }
    // ... manejo de otros tipos de errores
  }
}
```

### Registro Global

```typescript
// src/app.module.ts
import { GlobalExceptionFilter } from './infrastructure/filters';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
```

---

## 📤 Ejemplos de Respuestas HTTP

### 404 - Not Found

**Request**: `GET /products/abc-123`

**Error lanzado**: `throw new ProductNotFoundError('abc-123')`

**Respuesta**:
```json
{
  "code": "PRODUCT_NOT_FOUND",
  "message": "Producto con ID abc-123 no encontrado",
  "statusCode": 404,
  "timestamp": "2025-10-27T18:30:00.000Z",
  "path": "/products/abc-123",
  "isOperational": true
}
```

### 409 - Conflict (Already Exists)

**Request**: `POST /products` con SKU duplicado

**Error lanzado**: `throw new ProductAlreadyExistsError('SKU', 'PROD-001')`

**Respuesta**:
```json
{
  "code": "PRODUCT_ALREADY_EXISTS",
  "message": "Ya existe un producto con SKU: PROD-001",
  "statusCode": 409,
  "timestamp": "2025-10-27T18:30:00.000Z",
  "path": "/products",
  "isOperational": true
}
```

### 400 - Bad Request (Validation)

**Request**: `POST /products` con precio negativo

**Error lanzado**: `throw new InvalidPriceError('El precio no puede ser negativo')`

**Respuesta**:
```json
{
  "code": "INVALID_PRICE",
  "message": "Precio inválido: El precio no puede ser negativo",
  "statusCode": 400,
  "timestamp": "2025-10-27T18:30:00.000Z",
  "path": "/products",
  "isOperational": true
}
```

### 403 - Forbidden (Store Access Denied)

**Request**: `GET /products/product-of-other-store` (como ADMIN)

**Error lanzado**: `throw new ResourceAccessDeniedError('producto')`

**Respuesta**:
```json
{
  "code": "RESOURCE_ACCESS_DENIED",
  "message": "No tiene permisos para acceder a este producto",
  "statusCode": 403,
  "timestamp": "2025-10-27T18:30:00.000Z",
  "path": "/products/product-of-other-store",
  "isOperational": true
}
```

### 410 - Gone (Deleted Entity)

**Request**: `PATCH /products/deleted-product-id`

**Error lanzado**: `throw new ProductDeletedError('deleted-product-id')`

**Respuesta**:
```json
{
  "code": "PRODUCT_DELETED",
  "message": "No se puede realizar la operación. El producto con ID deleted-product-id está eliminado",
  "statusCode": 410,
  "timestamp": "2025-10-27T18:30:00.000Z",
  "path": "/products/deleted-product-id",
  "isOperational": true
}
```

### 500 - Internal Server Error

**Request**: `POST /purchases`

**Error lanzado**: `throw new PurchaseCreationError('Database connection lost')`

**Respuesta**:
```json
{
  "code": "PURCHASE_CREATION_ERROR",
  "message": "Error al crear la compra: Database connection lost",
  "statusCode": 500,
  "timestamp": "2025-10-27T18:30:00.000Z",
  "path": "/purchases",
  "isOperational": false
}
```

---

## ✅ Mejores Prácticas

### 1. ✅ Usa errores de dominio, NO excepciones de NestJS

```typescript
// ❌ INCORRECTO - Viola Clean Architecture
import { NotFoundException, BadRequestException } from '@nestjs/common';

if (!product) {
  throw new NotFoundException('Product not found'); // ❌
}

// ✅ CORRECTO - Respeta Clean Architecture
import { ProductNotFoundError } from '../../errors/domain-errors';

if (!product) {
  throw new ProductNotFoundError(id); // ✅
}
```

### 2. ✅ Define mensajes descriptivos en español

```typescript
// ❌ Mensaje vago
throw new InvalidPriceError('Invalid');

// ✅ Mensaje claro
throw new InvalidPriceError('El precio no puede ser negativo o cero');
```

### 3. ✅ Usa códigos únicos en SCREAMING_SNAKE_CASE

```typescript
readonly code = 'PRODUCT_NOT_FOUND'; // ✅
readonly code = 'product-not-found'; // ❌
readonly code = 'ProductNotFound';   // ❌
```

### 4. ✅ Clasifica correctamente con isOperational

```typescript
// Error esperado (validación, not found, etc.)
readonly isOperational = true; // ✅

// Error crítico del servidor (database crash, etc.)
readonly isOperational = false; // ✅
```

### 5. ✅ Usa el HTTP status code correcto

| Status | Significado | Ejemplo |
|--------|-------------|---------|
| 400 | Bad Request | Validación fallida, datos inválidos |
| 401 | Unauthorized | Token inválido, no autenticado |
| 403 | Forbidden | Autenticado pero sin permisos |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Duplicado (email, SKU, RUC, etc.) |
| 410 | Gone | Recurso eliminado (soft delete) |
| 500 | Internal Server Error | Error crítico del servidor |

### 6. ✅ Lanza errores en Use-Cases, NO en Controllers

```typescript
// ❌ INCORRECTO - Lanzar en controller
@Get(':id')
async getProduct(@Param('id') id: string) {
  const product = await this.service.getById(id);
  if (!product) {
    throw new ProductNotFoundError(id); // ❌ Controller no debe lanzar
  }
}

// ✅ CORRECTO - Lanzar en use-case
export class GetProductByIdUseCase {
  async execute(id: string) {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new ProductNotFoundError(id); // ✅ Use-case lanza el error
    }
    return product;
  }
}
```

### 7. ✅ No captures errores de dominio innecesariamente

```typescript
// ❌ INCORRECTO - Capturar y re-lanzar sin sentido
try {
  return await this.useCase.execute(id);
} catch (error) {
  if (error instanceof ProductNotFoundError) {
    throw error; // ❌ Inútil
  }
}

// ✅ CORRECTO - Dejar que el error se propague
return await this.useCase.execute(id); // ✅ El GlobalFilter lo maneja
```

### 8. ✅ Testea los errores de dominio

```typescript
describe('GetProductByIdUseCase', () => {
  it('should throw ProductNotFoundError when product does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id'))
      .rejects
      .toThrow(ProductNotFoundError);
  });
});
```

---

## 📚 Referencias

- **Clean Architecture**: Robert C. Martin
- **Domain-Driven Design**: Eric Evans
- **NestJS Exception Filters**: [https://docs.nestjs.com/exception-filters](https://docs.nestjs.com/exception-filters)

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0  
**Autor**: Backend Team

