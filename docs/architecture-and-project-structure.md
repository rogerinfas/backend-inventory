# 🏗️ Documentación de Arquitectura y Estructura del Proyecto

## 📖 Índice
1. [Introducción](#introducción)
2. [Arquitectura General](#arquitectura-general)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Clean Architecture Implementation](#clean-architecture-implementation)
5. [Tecnologías y Dependencias](#tecnologías-y-dependencias)
6. [Configuración del Proyecto](#configuración-del-proyecto)
7. [Base de Datos](#base-de-datos)
8. [Testing Strategy](#testing-strategy)
9. [Desarrollo y Despliegue](#desarrollo-y-despliegue)
10. [Mejores Prácticas](#mejores-prácticas)
11. [Diagramas de Arquitectura](#diagramas-de-arquitectura)

---

## 🎯 Introducción

**Backend Inventory** es un sistema de gestión de inventario desarrollado con **NestJS** y **Clean Architecture**. El proyecto implementa una arquitectura limpia y escalable que separa las responsabilidades en capas bien definidas, facilitando el mantenimiento, testing y evolución del sistema.

### Características Principales
- ✅ **Clean Architecture** con separación clara de capas
- ✅ **NestJS Framework** para aplicaciones Node.js escalables
- ✅ **TypeScript** para tipado estático y mejor DX
- ✅ **Prisma ORM** para gestión de base de datos
- ✅ **PostgreSQL** como base de datos principal
- ✅ **Docker** para containerización
- ✅ **Swagger** para documentación de API
- ✅ **Testing** con Jest y Supertest
- ✅ **ESLint + Prettier** para calidad de código

---

## 🏗️ Arquitectura General

### Principios Arquitectónicos

#### 1. **Clean Architecture (Arquitectura Limpia)**
- **Independencia del Framework**: El sistema no depende de NestJS
- **Testabilidad**: Las reglas de negocio pueden probarse sin dependencias externas
- **Independencia de la UI**: La interfaz puede cambiar sin afectar el negocio
- **Independencia de la Base de Datos**: Se puede cambiar de PostgreSQL a otra DB
- **Independencia de Agentes Externos**: Las reglas de negocio no conocen el mundo exterior

#### 2. **Regla de Dependencia**
> Las dependencias del código fuente solo pueden apuntar hacia adentro

```
🎯 Dominio ← 🔧 Aplicación ← 🔌 Infraestructura
```

#### 3. **Principios SOLID**
- **S** - Single Responsibility Principle
- **O** - Open/Closed Principle  
- **L** - Liskov Substitution Principle
- **I** - Interface Segregation Principle
- **D** - Dependency Inversion Principle

### Estructura de Capas

```mermaid
graph TB
    subgraph "🔌 Infraestructura (Frameworks & Drivers)"
        A[Controllers]
        B[Repositories Implementation]
        C[Database]
        D[External Services]
    end

    subgraph "🔧 Aplicación (Interface Adapters)"
        E[Use Cases]
        F[Services]
        G[DTOs]
        H[Mappers]
    end

    subgraph "🎯 Dominio (Entities & Use Cases)"
        I[Entities]
        J[Value Objects]
        K[Enums]
        L[Repository Interfaces]
    end

    A --> E
    E --> I
    E --> L
    L --> B
    B --> C
    F --> E
    G --> H
    H --> I
```

---

## 📁 Estructura del Proyecto

### Organización General

```
backend-inventory/
├── 📁 docs/                          # Documentación del proyecto
│   ├── person-implementation-guide.md
│   └── architecture-and-project-structure.md
├── 📁 src/                           # Código fuente principal
│   ├── 📁 domain/                    # 🎯 Capa de Dominio
│   ├── 📁 application/               # 🔧 Capa de Aplicación
│   ├── 📁 infrastructure/            # 🔌 Capa de Infraestructura
│   ├── app.module.ts                 # Módulo principal de la aplicación
│   └── main.ts                       # Punto de entrada de la aplicación
├── 📁 test/                          # Tests end-to-end
├── 📁 prisma/                        # Configuración de base de datos
├── 📁 dist/                          # Código compilado (generado)
├── 📁 node_modules/                  # Dependencias (generado)
├── 📄 package.json                   # Configuración del proyecto
├── 📄 tsconfig.json                  # Configuración de TypeScript
├── 📄 nest-cli.json                  # Configuración de NestJS CLI
├── 📄 docker-compose.yml             # Configuración de Docker
├── 📄 eslint.config.mjs              # Configuración de ESLint
├── 📄 pnpm-workspace.yaml            # Configuración de pnpm
└── 📄 README.md                      # Documentación básica
```

### Detalle de la Estructura

#### 🎯 **Capa de Dominio** (`src/domain/`)

```
src/domain/
├── 📁 entities/                      # Entidades de negocio
│   ├── person.entity.ts             # Entidad Person (agregado raíz)
│   └── index.ts                     # Exportaciones
├── 📁 value-objects/                # Objetos de valor
│   ├── document.value-object.ts     # Validación de documentos
│   ├── email.value-object.ts        # Validación de emails
│   ├── phone.value-object.ts        # Validación de teléfonos
│   └── index.ts                     # Exportaciones
├── 📁 enums/                        # Enumeraciones
│   ├── document-type.enum.ts        # Tipos de documento
│   ├── entity-status.enum.ts        # Estados de entidad
│   └── index.ts                     # Exportaciones
├── 📁 repositories/                 # Interfaces de repositorios
│   ├── person.repository.ts         # Interfaz PersonRepository
│   └── index.ts                     # Exportaciones
├── 📁 services/                     # Servicios de dominio (futuro)
│   └── index.ts                     # Exportaciones
└── index.ts                         # Exportaciones principales
```

**Características**:
- ✅ **Independiente** de frameworks externos
- ✅ **Entidades** con lógica de negocio encapsulada
- ✅ **Value Objects** inmutables con validaciones
- ✅ **Interfaces** para repositorios (no implementaciones)
- ✅ **Enums** para constantes de dominio

#### 🔧 **Capa de Aplicación** (`src/application/`)

```
src/application/
├── 📁 use-cases/                    # Casos de uso
│   └── 📁 person/                   # Casos de uso de Person
│       ├── create-person.use-case.ts
│       ├── update-person.use-case.ts
│       ├── get-person-by-id.use-case.ts
│       ├── get-person-by-document.use-case.ts
│       ├── list-persons.use-case.ts
│       ├── change-person-status.use-case.ts
│       ├── delete-person.use-case.ts
│       └── index.ts
├── 📁 services/                     # Servicios de aplicación
│   ├── person.service.ts            # Orquestador de casos de uso
│   └── index.ts
├── 📁 dto/                          # Data Transfer Objects
│   ├── 📁 person/                   # DTOs de Person
│   │   ├── create-person.dto.ts
│   │   ├── update-person.dto.ts
│   │   ├── person-response.dto.ts
│   │   ├── person-query.dto.ts
│   │   ├── change-person-status.dto.ts
│   │   └── index.ts
│   ├── 📁 error/                    # DTOs de error
│   │   ├── error-response.dto.ts
│   │   ├── validation-error.dto.ts
│   │   └── index.ts
│   └── index.ts
├── 📁 mappers/                      # Mappers entre capas
│   ├── person.mapper.ts             # Mapper de Person
│   └── index.ts
├── 📁 errors/                       # Errores de dominio
│   ├── domain-errors.ts             # Clases de error personalizadas
│   └── index.ts
└── index.ts                         # Exportaciones principales
```

**Características**:
- ✅ **Use Cases** específicos y enfocados
- ✅ **DTOs** para transferencia de datos
- ✅ **Mappers** para conversión entre capas
- ✅ **Servicios** como orquestadores
- ✅ **Errores** de dominio personalizados

#### 🔌 **Capa de Infraestructura** (`src/infrastructure/`)

```
src/infrastructure/
├── 📁 controllers/                  # Controladores HTTP
│   ├── person.controller.ts         # Controlador de Person
│   └── index.ts
├── 📁 repositories/                 # Implementaciones de repositorios
│   ├── person.repository.ts         # Implementación Prisma
│   └── index.ts
├── 📁 modules/                      # Módulos de NestJS
│   ├── person.module.ts             # Módulo de Person
│   ├── database.module.ts           # Módulo de base de datos
│   └── index.ts
├── 📁 database/                     # Configuración de base de datos
│   ├── prisma.service.ts            # Servicio de Prisma
│   └── index.ts
├── 📁 filters/                      # Filtros globales
│   ├── global-exception.filter.ts   # Manejo de errores
│   └── index.ts
└── index.ts                         # Exportaciones principales
```

**Características**:
- ✅ **Controladores** para endpoints HTTP
- ✅ **Implementaciones** de repositorios
- ✅ **Módulos** de NestJS
- ✅ **Servicios** de infraestructura
- ✅ **Filtros** globales

---

## 🎯 Clean Architecture Implementation

### Flujo de Dependencias

```mermaid
graph LR
    subgraph "🔌 Infraestructura"
        A[PersonController]
        B[PersonPrismaRepository]
        C[PrismaService]
        D[PostgreSQL]
    end

    subgraph "🔧 Aplicación"
        E[PersonService]
        F[CreatePersonUseCase]
        G[PersonMapper]
        H[CreatePersonDto]
    end

    subgraph "🎯 Dominio"
        I[Person Entity]
        J[Document Value Object]
        K[PersonRepository Interface]
    end

    A --> E
    E --> F
    F --> K
    F --> G
    F --> I
    K --> B
    B --> C
    C --> D
    G --> I
    I --> J
    H --> G
```

### Principios Aplicados

#### 1. **Inversión de Dependencias**
```typescript
// ❌ MAL - Dependencia directa
class CreatePersonUseCase {
  constructor(private repository: PersonPrismaRepository) {}
}

// ✅ BIEN - Dependencia de abstracción
class CreatePersonUseCase {
  constructor(private repository: PersonRepository) {}
}
```

#### 2. **Separación de Responsabilidades**
```typescript
// Dominio - Lógica de negocio
class Person {
  updateNames(names: string): void {
    if (!names || names.trim().length === 0) {
      throw new Error('Los nombres no pueden estar vacíos');
    }
    this._names = names.trim();
    this._updatedAt = new Date();
  }
}

// Aplicación - Orquestación
class UpdatePersonUseCase {
  async execute(id: string, dto: UpdatePersonDto): Promise<PersonResponseDto> {
    const person = await this.repository.findById(id);
    const updatedPerson = PersonMapper.toUpdateDomain(dto, person);
    const savedPerson = await this.repository.update(updatedPerson);
    return PersonMapper.toResponseDto(savedPerson);
  }
}

// Infraestructura - Detalles técnicos
@Controller('persons')
export class PersonController {
  @Put(':id')
  async updatePerson(@Param('id') id: string, @Body() dto: UpdatePersonDto) {
    return this.personService.updatePerson(id, dto);
  }
}
```

#### 3. **Encapsulación**
```typescript
// Entidad con estado privado y métodos públicos
class Person {
  private constructor(
    private readonly _id: string,
    private _names: string,
    // ... otros campos privados
  ) {}

  // Métodos públicos para acceder al estado
  get id(): string { return this._id; }
  get names(): string { return this._names; }

  // Métodos de negocio que encapsulan la lógica
  updateNames(names: string): void {
    this.validateNames(names);
    this._names = names.trim();
    this._updatedAt = new Date();
  }
}
```

---

## 🛠️ Tecnologías y Dependencias

### Stack Tecnológico Principal

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **TypeScript** | 5.9.3 | Lenguaje de programación |
| **NestJS** | 11.1.6 | Framework de aplicaciones |
| **Prisma** | 6.17.1 | ORM para base de datos |
| **PostgreSQL** | 15 | Base de datos relacional |
| **Docker** | 3.8 | Containerización |

### Dependencias de Producción

```json
{
  "dependencies": {
    "@nestjs/common": "^11.1.6",           // Funcionalidades básicas de NestJS
    "@nestjs/core": "^11.1.6",             // Núcleo de NestJS
    "@nestjs/platform-express": "^11.1.6", // Adaptador HTTP Express
    "@nestjs/swagger": "^11.2.1",          // Documentación de API
    "@prisma/client": "^6.17.1",           // Cliente de Prisma
    "@scalar/nestjs-api-reference": "^1.0.5", // Referencia de API moderna
    "class-transformer": "^0.5.1",         // Transformación de clases
    "class-validator": "^0.14.2",          // Validación de DTOs
    "prisma": "^6.17.1",                   // CLI de Prisma
    "reflect-metadata": "^0.2.2",          // Metadatos para decoradores
    "rxjs": "^7.8.2",                      // Programación reactiva
    "swagger-ui-express": "^5.0.1"         // UI de Swagger
  }
}
```

### Dependencias de Desarrollo

```json
{
  "devDependencies": {
    "@eslint/eslintrc": "^3.3.1",          // Configuración de ESLint
    "@eslint/js": "^9.37.0",               // Reglas de ESLint
    "@nestjs/cli": "^11.0.10",             // CLI de NestJS
    "@nestjs/schematics": "^11.0.9",       // Generadores de código
    "@nestjs/testing": "^11.1.6",          // Utilidades de testing
    "@types/express": "^5.0.3",            // Tipos de Express
    "@types/jest": "^30.0.0",              // Tipos de Jest
    "@types/node": "^22.18.11",            // Tipos de Node.js
    "@types/supertest": "^6.0.3",          // Tipos de Supertest
    "eslint": "^9.37.0",                   // Linter de JavaScript/TypeScript
    "eslint-config-prettier": "^10.1.8",   // Configuración de Prettier para ESLint
    "eslint-plugin-prettier": "^5.5.4",    // Plugin de Prettier para ESLint
    "globals": "^16.4.0",                  // Variables globales para ESLint
    "jest": "^30.2.0",                     // Framework de testing
    "prettier": "^3.6.2",                  // Formateador de código
    "source-map-support": "^0.5.21",       // Soporte para source maps
    "supertest": "^7.1.4",                 // Testing de APIs HTTP
    "ts-jest": "^29.4.5",                  // Preset de Jest para TypeScript
    "ts-loader": "^9.5.4",                 // Loader de TypeScript para webpack
    "ts-node": "^10.9.2",                  // Ejecutor de TypeScript
    "tsconfig-paths": "^4.2.0",            // Resolución de paths de TypeScript
    "typescript": "^5.9.3",                // Compilador de TypeScript
    "typescript-eslint": "^8.46.1"         // Reglas de ESLint para TypeScript
  }
}
```

---

## ⚙️ Configuración del Proyecto

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "module": "nodenext",                    // Módulos ESM
    "moduleResolution": "nodenext",          // Resolución de módulos
    "resolvePackageJsonExports": true,       // Resolver exports de package.json
    "esModuleInterop": true,                 // Interoperabilidad ESM/CommonJS
    "isolatedModules": true,                 // Módulos aislados
    "declaration": true,                     // Generar archivos .d.ts
    "removeComments": true,                  // Remover comentarios del output
    "emitDecoratorMetadata": true,           // Metadatos para decoradores
    "experimentalDecorators": true,          // Decoradores experimentales
    "allowSyntheticDefaultImports": true,    // Imports sintéticos
    "target": "ES2022",                      // Target de compilación
    "sourceMap": true,                       // Generar source maps
    "outDir": "./dist",                      // Directorio de salida
    "baseUrl": "./",                         // Base URL para imports
    "incremental": true,                     // Compilación incremental
    "skipLibCheck": true,                    // Saltar verificación de librerías
    "strictNullChecks": true,                // Verificación estricta de null
    "forceConsistentCasingInFileNames": true, // Consistencia en nombres de archivos
    "noImplicitAny": false,                  // Permitir any implícito
    "strictBindCallApply": false,            // Verificación estricta de bind/call/apply
    "noFallthroughCasesInSwitch": false      // Permitir fallthrough en switch
  }
}
```

### NestJS Configuration (`nest-cli.json`)

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",        // Colección de schematics
  "sourceRoot": "src",                       // Directorio raíz del código fuente
  "compilerOptions": {
    "deleteOutDir": true                     // Eliminar directorio de salida antes de compilar
  }
}
```

### ESLint Configuration (`eslint.config.mjs`)

```javascript
export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],          // Archivos a ignorar
  },
  eslint.configs.recommended,                // Configuración recomendada
  ...tseslint.configs.recommendedTypeChecked, // Configuración recomendada de TypeScript
  eslintPluginPrettierRecommended,          // Configuración de Prettier
  {
    languageOptions: {
      globals: {
        ...globals.node,                     // Variables globales de Node.js
        ...globals.jest,                    // Variables globales de Jest
      },
      sourceType: 'commonjs',               // Tipo de módulo
      parserOptions: {
        projectService: true,                // Servicio de proyecto
        tsconfigRootDir: import.meta.dirname, // Directorio raíz de tsconfig
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',           // Permitir any explícito
      '@typescript-eslint/no-floating-promises': 'warn',     // Advertir promesas flotantes
      '@typescript-eslint/no-unsafe-argument': 'warn'        // Advertir argumentos no seguros
    },
  },
);
```

### Jest Configuration

#### Unit Tests (`package.json`)
```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

#### E2E Tests (`test/jest-e2e.json`)
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```

### pnpm Configuration (`pnpm-workspace.yaml`)

```yaml
ignoredBuiltDependencies:
  - '@scarf/scarf'                          # Ignorar dependencias de telemetría

onlyBuiltDependencies:
  - '@nestjs/core'                          # Solo construir dependencias específicas
  - unrs-resolver
```

---

## 🗄️ Base de Datos

### PostgreSQL Configuration

#### Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine              # Imagen de PostgreSQL 15 Alpine
    container_name: inventory-postgres     # Nombre del contenedor
    restart: unless-stopped                # Política de reinicio
    environment:
      POSTGRES_DB: inventorydb             # Nombre de la base de datos
      POSTGRES_USER: roger                 # Usuario de la base de datos
      POSTGRES_PASSWORD: roger123          # Contraseña de la base de datos
    ports:
      - "5432:5432"                        # Puerto de la base de datos
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Volumen persistente
    networks:
      - inventory-network                  # Red personalizada

volumes:
  postgres_data:                           # Volumen para persistencia

networks:
  inventory-network:                       # Red personalizada
    driver: bridge
```

### Prisma Schema (`prisma/schema.prisma`)

```prisma
// Prisma Schema for Person Management System
generator client {
  provider = "prisma-client-js"            // Generador del cliente Prisma
}

datasource db {
  provider = "postgresql"                  // Proveedor de base de datos
  url      = env("DATABASE_URL")           // URL de conexión desde variable de entorno
}

// Enumeraciones
enum DocumentType {
  DNI       // Documento Nacional de Identidad
  RUC       // Registro Único de Contribuyentes
  CE        // Carné de Extranjería
  PASSPORT  // Pasaporte
}

enum EntityStatus {
  ACTIVE    // Activo
  INACTIVE  // Inactivo
  SUSPENDED // Suspendido
  DELETED   // Eliminado
}

// Modelo de datos
model Person {
  id              String   @id @default(uuid())           // ID único
  documentType    DocumentType @map("document_type")      // Tipo de documento
  documentNumber  String   @unique @map("document_number") // Número de documento (único)
  names           String                                   // Nombres completos
  legalName       String?  @map("legal_name")             // Nombre legal (opcional)
  address         String?                                  // Dirección (opcional)
  phone           String?                                  // Teléfono (opcional)
  email           String?                                  // Email (opcional)
  status          EntityStatus @default(ACTIVE)           // Estado (por defecto ACTIVE)
  createdAt       DateTime @default(now()) @map("created_at") // Fecha de creación
  updatedAt       DateTime @updatedAt @map("updated_at")  // Fecha de actualización
  
  @@index([documentNumber])                               // Índice en documentNumber
  @@index([status])                                       // Índice en status
  @@map("persons")                                        // Nombre de la tabla
}
```

### Migración de Base de Datos

#### SQL Migration (`prisma/migrations/20251017101700_init_person_only/migration.sql`)

```sql
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('DNI', 'RUC', 'CE', 'PASSPORT');

-- CreateEnum
CREATE TYPE "EntityStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED');

-- CreateTable
CREATE TABLE "persons" (
    "id" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "document_number" TEXT NOT NULL,
    "names" TEXT NOT NULL,
    "legal_name" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "persons_document_number_key" ON "persons"("document_number");

-- CreateIndex
CREATE INDEX "persons_document_number_idx" ON "persons"("document_number");

-- CreateIndex
CREATE INDEX "persons_status_idx" ON "persons"("status");
```

### Variables de Entorno

```bash
# .env
DATABASE_URL="postgresql://roger:roger123@localhost:5432/inventorydb?schema=public"
PORT=9987
NODE_ENV=development
```

---

## 🧪 Testing Strategy

### Estrategia de Testing

#### 1. **Unit Tests**
- **Entidades de Dominio**: Validaciones y lógica de negocio
- **Value Objects**: Validaciones específicas
- **Use Cases**: Lógica de aplicación
- **Mappers**: Conversiones entre capas

#### 2. **Integration Tests**
- **Repositorios**: Interacción con base de datos
- **Servicios**: Orquestación de casos de uso
- **Módulos**: Configuración de dependencias

#### 3. **E2E Tests**
- **Endpoints**: Flujo completo de APIs
- **Escenarios**: Casos de uso completos
- **Validaciones**: Respuestas y códigos de estado

### Configuración de Testing

#### Jest Configuration
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": [
    "**/*.(t|j)s"
  ],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node"
}
```

#### Scripts de Testing
```json
{
  "scripts": {
    "test": "jest",                    // Tests unitarios
    "test:watch": "jest --watch",      // Tests en modo watch
    "test:cov": "jest --coverage",     // Tests con cobertura
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"  // Tests E2E
  }
}
```

### Estructura de Tests

```
test/
├── 📁 unit/                          # Tests unitarios
│   ├── 📁 domain/
│   │   ├── person.entity.spec.ts
│   │   ├── document.value-object.spec.ts
│   │   └── email.value-object.spec.ts
│   ├── 📁 application/
│   │   ├── create-person.use-case.spec.ts
│   │   └── person.mapper.spec.ts
│   └── 📁 infrastructure/
│       └── person.repository.spec.ts
├── 📁 integration/                   # Tests de integración
│   ├── person.service.spec.ts
│   └── person.module.spec.ts
├── 📁 e2e/                          # Tests end-to-end
│   ├── person.e2e-spec.ts
│   └── app.e2e-spec.ts
└── jest-e2e.json                    # Configuración E2E
```

---

## 🚀 Desarrollo y Despliegue

### Scripts de Desarrollo

```json
{
  "scripts": {
    "build": "nest build",                    // Compilar el proyecto
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"", // Formatear código
    "start": "nest start",                    // Iniciar en modo producción
    "start:dev": "nest start --watch",        // Iniciar en modo desarrollo
    "start:debug": "nest start --debug --watch", // Iniciar en modo debug
    "start:prod": "node dist/main",           // Iniciar compilado
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix" // Linter
  }
}
```

### Flujo de Desarrollo

#### 1. **Configuración Inicial**
```bash
# Clonar el repositorio
git clone <repository-url>
cd backend-inventory

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar base de datos
docker-compose up -d

# Ejecutar migraciones
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate
```

#### 2. **Desarrollo Diario**
```bash
# Iniciar en modo desarrollo
pnpm run start:dev

# Ejecutar tests
pnpm run test

# Ejecutar tests en modo watch
pnpm run test:watch

# Verificar código
pnpm run lint

# Formatear código
pnpm run format
```

#### 3. **Testing y Calidad**
```bash
# Tests unitarios
pnpm run test

# Tests con cobertura
pnpm run test:cov

# Tests E2E
pnpm run test:e2e

# Linting
pnpm run lint
```

#### 4. **Build y Deploy**
```bash
# Compilar para producción
pnpm run build

# Iniciar en producción
pnpm run start:prod
```

### Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 9987
CMD ["npm", "run", "start:prod"]
```

#### Docker Compose para Producción
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "9987:9987"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://roger:roger123@postgres:5432/inventorydb
    depends_on:
      - postgres
    networks:
      - inventory-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=inventorydb
      - POSTGRES_USER=roger
      - POSTGRES_PASSWORD=roger123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - inventory-network

volumes:
  postgres_data:

networks:
  inventory-network:
    driver: bridge
```

---

## 📊 Diagramas de Arquitectura

### Arquitectura General del Sistema

```mermaid
graph TB
    subgraph "🌐 Cliente"
        A[Frontend App]
        B[Mobile App]
        C[API Client]
    end

    subgraph "🔌 Infraestructura"
        D[Load Balancer]
        E[NestJS App]
        F[PostgreSQL]
        G[Redis Cache]
    end

    subgraph "🔧 Aplicación"
        H[Use Cases]
        I[Services]
        J[DTOs]
    end

    subgraph "🎯 Dominio"
        K[Entities]
        L[Value Objects]
        M[Repository Interfaces]
    end

    A --> D
    B --> D
    C --> D
    D --> E
    E --> H
    H --> K
    H --> M
    M --> F
    E --> G
```

### Flujo de Datos en Clean Architecture

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant UseCase
    participant Repository
    participant Database

    Client->>Controller: HTTP Request
    Controller->>Service: Service Method
    Service->>UseCase: Execute Use Case
    UseCase->>Repository: Domain Operation
    Repository->>Database: SQL Query
    Database-->>Repository: Data
    Repository-->>UseCase: Domain Entity
    UseCase-->>Service: Use Case Result
    Service-->>Controller: Service Response
    Controller-->>Client: HTTP Response
```

### Estructura de Módulos NestJS

```mermaid
graph TB
    subgraph "AppModule"
        A[DatabaseModule]
        B[PersonModule]
    end

    subgraph "PersonModule"
        C[PersonController]
        D[PersonService]
        E[PersonPrismaRepository]
        F[PrismaService]
    end

    subgraph "DatabaseModule"
        G[PrismaService]
    end

    A --> G
    B --> C
    B --> D
    B --> E
    B --> F
    E --> F
    F --> G
```

---

## ✅ Mejores Prácticas

### 1. **Arquitectura y Diseño**

#### Clean Architecture
- ✅ **Separación clara** de responsabilidades por capas
- ✅ **Dependencias** que fluyen hacia adentro
- ✅ **Interfaces** para abstraer implementaciones
- ✅ **Independencia** de frameworks externos

#### Principios SOLID
- ✅ **Single Responsibility**: Cada clase tiene una responsabilidad
- ✅ **Open/Closed**: Abierto para extensión, cerrado para modificación
- ✅ **Liskov Substitution**: Las subclases son sustituibles
- ✅ **Interface Segregation**: Interfaces específicas y pequeñas
- ✅ **Dependency Inversion**: Depender de abstracciones, no concreciones

### 2. **Código y Calidad**

#### TypeScript
- ✅ **Tipado estricto** para prevenir errores
- ✅ **Interfaces** para contratos claros
- ✅ **Enums** para constantes de dominio
- ✅ **Generics** para reutilización de código

#### Testing
- ✅ **Tests unitarios** para lógica de negocio
- ✅ **Tests de integración** para servicios
- ✅ **Tests E2E** para flujos completos
- ✅ **Cobertura** de código adecuada

#### Código Limpio
- ✅ **Nombres descriptivos** para variables y funciones
- ✅ **Funciones pequeñas** y enfocadas
- ✅ **Comentarios** donde sea necesario
- ✅ **Consistencia** en el estilo de código

### 3. **Base de Datos**

#### Prisma ORM
- ✅ **Schema** bien definido y versionado
- ✅ **Migraciones** para cambios de estructura
- ✅ **Índices** para optimizar consultas
- ✅ **Validaciones** a nivel de base de datos

#### PostgreSQL
- ✅ **Normalización** adecuada de datos
- ✅ **Índices** en campos de búsqueda frecuente
- ✅ **Constraints** para integridad de datos
- ✅ **Backups** regulares

### 4. **API y Documentación**

#### REST API
- ✅ **Endpoints** RESTful y consistentes
- ✅ **Códigos de estado** HTTP apropiados
- ✅ **Validación** de entrada con DTOs
- ✅ **Manejo de errores** centralizado

#### Documentación
- ✅ **Swagger** para documentación de API
- ✅ **Comentarios** en código
- ✅ **README** actualizado
- ✅ **Guías** de implementación

### 5. **Seguridad**

#### Validación
- ✅ **Validación** de entrada en todas las capas
- ✅ **Sanitización** de datos
- ✅ **Escape** de consultas SQL
- ✅ **Rate limiting** para APIs

#### Autenticación y Autorización
- ✅ **JWT** para autenticación (futuro)
- ✅ **Roles** y permisos (futuro)
- ✅ **Middleware** de seguridad (futuro)

### 6. **Performance**

#### Optimización
- ✅ **Índices** de base de datos
- ✅ **Paginación** para listas grandes
- ✅ **Caching** para datos frecuentes (futuro)
- ✅ **Compresión** de respuestas (futuro)

#### Monitoreo
- ✅ **Logs** estructurados
- ✅ **Métricas** de performance (futuro)
- ✅ **Health checks** (futuro)

---

## 🎯 Conclusión

Esta documentación proporciona una visión completa de la arquitectura y estructura del proyecto **Backend Inventory**. El sistema implementa Clean Architecture de manera rigurosa, separando claramente las responsabilidades en capas bien definidas.

### Características Destacadas

1. **Arquitectura Limpia**: Implementación fiel a los principios de Clean Architecture
2. **Escalabilidad**: Estructura que permite crecimiento y evolución
3. **Mantenibilidad**: Código organizado y bien documentado
4. **Testabilidad**: Arquitectura que facilita el testing
5. **Flexibilidad**: Fácil cambio de tecnologías en capas externas

### Próximos Pasos

1. **Implementar autenticación** y autorización
2. **Agregar más entidades** del dominio de inventario
3. **Implementar caching** con Redis
4. **Agregar monitoreo** y métricas
5. **Implementar CI/CD** pipeline

La arquitectura actual proporciona una base sólida para el desarrollo de un sistema de inventario robusto y escalable.

---

*Documentación generada automáticamente - Backend Inventory System v0.0.1*
