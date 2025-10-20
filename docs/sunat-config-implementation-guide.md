# Documentación del Módulo SunatConfig

## Descripción General

El módulo `SunatConfig` gestiona la configuración de SUNAT (Superintendencia Nacional de Aduanas y de Administración Tributaria) para cada tienda del sistema. Permite configurar credenciales SOL, certificados digitales y ambientes de trabajo para la emisión de comprobantes electrónicos.

## Características Principales

- **Configuración única por tienda**: Cada tienda puede tener solo una configuración SUNAT
- **Gestión de credenciales SOL**: Usuario y contraseña del Sistema de Operaciones en Línea
- **Certificados digitales**: Soporte para certificados digitales con contraseña
- **Ambientes múltiples**: Soporte para ambiente de pruebas (TEST) y producción (PRODUCTION)
- **API personalizable**: URL personalizable para la API de SUNAT

## Estructura de Datos

### Campos Principales

| Campo | Tipo | Descripción | Requerido |
|-------|------|-------------|-----------|
| `id` | UUID | Identificador único de la configuración | ✅ |
| `storeId` | UUID | ID de la tienda asociada | ✅ |
| `solUsername` | String | Usuario SOL (3-50 caracteres) | ✅ |
| `solPassword` | String | Contraseña SOL (6-100 caracteres) | ✅ |
| `certificatePassword` | String | Contraseña del certificado digital | ❌ |
| `apiUrl` | String | URL de la API de SUNAT | ❌ |
| `environment` | Enum | Ambiente: TEST o PRODUCTION | ❌ |
| `createdAt` | DateTime | Fecha de creación | ✅ |
| `updatedAt` | DateTime | Fecha de última actualización | ✅ |

### Enums

#### SunatEnvironment
- `TEST`: Ambiente de pruebas
- `PRODUCTION`: Ambiente de producción

#### SunatStatus
- `PENDING`: Pendiente
- `ACCEPTED`: Aceptado
- `REJECTED`: Rechazado
- `ERROR`: Error

## Endpoints API

### 1. Crear Configuración SUNAT
```http
POST /sunat-config
```

**Body de ejemplo:**
```json
{
  "storeId": "123e4567-e89b-12d3-a456-426614174001",
  "solUsername": "usuario_sol_123",
  "solPassword": "mi_password_seguro_123",
  "certificatePassword": "cert_password_123",
  "apiUrl": "https://api.sunat.gob.pe/v1",
  "environment": "TEST"
}
```

### 2. Obtener por ID
```http
GET /sunat-config/:id
```

### 3. Obtener por Tienda
```http
GET /sunat-config/store/:storeId
```

### 4. Listar Configuraciones
```http
GET /sunat-config?page=1&limit=10&environment=TEST&storeId=123e4567-e89b-12d3-a456-426614174001
```

**Parámetros de consulta:**
- `storeId`: Filtrar por ID de tienda
- `environment`: Filtrar por ambiente (TEST/PRODUCTION)
- `page`: Número de página (1-1000)
- `limit`: Elementos por página (1-100)
- `sortBy`: Campo de ordenamiento (createdAt, updatedAt, solUsername)
- `sortOrder`: Orden (asc, desc)

### 5. Actualizar Configuración
```http
PATCH /sunat-config/:id
```

**Body de ejemplo:**
```json
{
  "solUsername": "nuevo_usuario_sol",
  "solPassword": "nueva_password_segura",
  "environment": "PRODUCTION"
}
```

### 6. Eliminar Configuración
```http
DELETE /sunat-config/:id
```

**Respuesta exitosa:**
- **Status Code**: `204 No Content`
- **Body**: Vacío (sin contenido)
- **Headers**: Solo headers estándar de HTTP

**Ejemplo de respuesta exitosa:**
```
HTTP/1.1 204 No Content
Content-Length: 0
Date: Mon, 15 Jan 2024 10:30:00 GMT
```

## Códigos de Respuesta

| Código | Descripción | Body de Respuesta |
|--------|-------------|-------------------|
| 200 | Operación exitosa | Datos de la configuración |
| 201 | Configuración creada exitosamente | Datos de la configuración creada |
| 204 | Configuración eliminada exitosamente | **Vacío** (sin contenido) |
| 400 | Datos de entrada inválidos | Mensaje de error |
| 404 | Configuración o tienda no encontrada | Mensaje de error |
| 409 | Ya existe configuración para esta tienda | Mensaje de error |

## Respuestas de Eliminación

### ✅ Eliminación Exitosa (HTTP 204)
```http
HTTP/1.1 204 No Content
Content-Length: 0
Date: Mon, 15 Jan 2024 10:30:00 GMT
```

**Características:**
- **Status Code**: `204 No Content`
- **Body**: Completamente vacío
- **Content-Type**: No aplicable
- **Content-Length**: `0`

### ❌ Error - No Encontrado (HTTP 404)
```json
{
  "statusCode": 404,
  "message": "Configuración SUNAT con ID 123e4567-e89b-12d3-a456-426614174000 no encontrada",
  "error": "Not Found"
}
```

## Validaciones

### Creación
- `storeId` debe ser un UUID válido
- `solUsername` debe tener entre 3 y 50 caracteres
- `solPassword` debe tener entre 6 y 100 caracteres
- `certificatePassword` máximo 100 caracteres
- `apiUrl` máximo 500 caracteres
- La tienda debe existir
- No puede existir otra configuración para la misma tienda

### Actualización
- Todos los campos son opcionales
- Se aplican las mismas validaciones de longitud
- Al menos un campo debe ser proporcionado

## Ejemplos de Uso

### Configuración Básica
```json
{
  "storeId": "123e4567-e89b-12d3-a456-426614174001",
  "solUsername": "mi_tienda_sol",
  "solPassword": "password123456",
  "environment": "TEST"
}
```

### Configuración Completa
```json
{
  "storeId": "123e4567-e89b-12d3-a456-426614174001",
  "solUsername": "mi_tienda_sol",
  "solPassword": "password123456",
  "certificatePassword": "cert123456",
  "apiUrl": "https://api.sunat.gob.pe/v1",
  "environment": "PRODUCTION"
}
```

### Respuesta de Listado
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "storeId": "123e4567-e89b-12d3-a456-426614174001",
      "solUsername": "mi_tienda_sol",
      "certificatePassword": "cert123456",
      "apiUrl": "https://api.sunat.gob.pe/v1",
      "environment": "TEST",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T14:45:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

## Notas de Seguridad

- **TODO: Las contraseñas SOL deben ser hasheadas en un futuro** - Actualmente se almacenan en texto plano
- Los certificados digitales se almacenan como Buffer
- **Las contraseñas SOL NO se incluyen en las respuestas de la API** por seguridad
- Se recomienda usar HTTPS para todas las comunicaciones
- Implementar rotación periódica de credenciales SOL

## Integración con Scalar

El módulo está completamente documentado para Scalar con:
- Ejemplos de request/response
- Descripciones detalladas de cada campo
- Códigos de error específicos
- Validaciones y restricciones
- Esquemas de datos completos

Accede a la documentación interactiva en: `/api-reference`
