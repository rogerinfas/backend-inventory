# 📊 Guía del Sistema de Ventas - Flujo Completo

## 🎯 Resumen de Cambios Implementados

Se ha implementado un flujo de ventas mejorado que cumple con los siguientes requisitos:

1. ✅ **Decrementar stock solo al completar la venta** (no al crearla)
2. ✅ **Generar correlativo y comprobante al completar** (no al crear)
3. ✅ **Restaurar stock automáticamente al cancelar** (CRÍTICO)
4. ✅ **Implementar devoluciones (refund)** con restauración de stock

---

## 📋 Estados de una Venta

```
┌──────────┐
│ PENDING  │ ← Venta recién creada (sin stock decrementado)
└────┬─────┘
     │
     ├─→ COMPLETED ← Stock decrementado, comprobante generado
     │       │
     │       ├─→ CANCELLED ← Stock restaurado
     │       └─→ REFUNDED ← Stock restaurado
     │
     └─→ CANCELLED ← Sin stock que restaurar (nunca se decrementó)
```

---

## 🔄 Flujo de Ventas - Descripción Detallada

### 1️⃣ **CREAR VENTA** - `POST /sales`

**Estado resultante:** `PENDING`

#### ✅ Lo que SÍ hace:
- Validar que la tienda existe
- Validar que el cliente existe
- Validar que el usuario vendedor existe
- Validar que todos los productos existen y pertenecen a la tienda
- Crear el registro de venta en la BD
- Crear los detalles de la venta (items)

#### ❌ Lo que NO hace:
- ❌ **NO decrementa el stock** (se hará al completar)
- ❌ **NO genera número de documento** (se hará al completar)
- ❌ **NO valida stock disponible** (se hará al completar)

#### 📝 Ejemplo de Request:
```json
POST /sales
{
  "storeId": "uuid-tienda",
  "customerId": "uuid-cliente",
  "userId": "uuid-vendedor",
  "documentType": "RECEIPT",
  "series": "B001",
  "saleDate": "2025-10-27T10:30:00Z",
  "subtotal": 100.00,
  "tax": 18.00,
  "discount": 0,
  "notes": "Venta pendiente de confirmación",
  "details": [
    {
      "productId": "uuid-producto-1",
      "quantity": 2,
      "unitPrice": 50.00,
      "discount": 0
    }
  ]
}
```

#### 📊 Response:
```json
{
  "id": "uuid-venta",
  "status": "PENDING",
  "documentNumber": null,
  "total": 118.00,
  "createdAt": "2025-10-27T10:30:00Z",
  ...
}
```

---

### 2️⃣ **COMPLETAR VENTA** - `POST /sales/:id/complete`

**Estado resultante:** `COMPLETED`

#### ✅ Lo que hace (TRANSACCIÓN ATÓMICA):
1. Buscar la venta con sus detalles
2. Verificar que está en estado `PENDING`
3. **Validar stock disponible** para todos los productos
4. **Decrementar stock** de cada producto
5. **Generar número de documento** si no existe
6. **Incrementar correlativo** de la serie
7. Cambiar estado a `COMPLETED`
8. Guardar cambios

#### ❌ Si falla:
- Si no hay stock suficiente → `InsufficientStockError`
- Si ya está completada → `SaleAlreadyCompletedError`
- Toda la transacción se revierte (rollback)

#### 📝 Ejemplo:
```http
POST /sales/uuid-venta/complete
```

#### 📊 Response:
```json
{
  "id": "uuid-venta",
  "status": "COMPLETED",
  "documentNumber": "B001-00000123",
  "total": 118.00,
  "updatedAt": "2025-10-27T10:35:00Z",
  ...
}
```

#### 🔄 Cambios en Base de Datos:
```sql
-- Sale
UPDATE sales SET 
  status = 'COMPLETED',
  documentNumber = 'B001-00000123',
  updatedAt = NOW()
WHERE id = 'uuid-venta';

-- Products (por cada item)
UPDATE products SET 
  currentStock = currentStock - quantity
WHERE id = 'uuid-producto-1';

-- VoucherSeries
UPDATE voucher_series SET 
  currentNumber = currentNumber + 1
WHERE storeId = 'uuid-tienda' 
  AND voucherType = 'RECEIPT' 
  AND series = 'B001';
```

---

### 3️⃣ **CANCELAR VENTA** - `DELETE /sales/:id`

**Estado resultante:** `CANCELLED`

#### ✅ Lo que hace (TRANSACCIÓN ATÓMICA):
1. Buscar la venta con sus detalles
2. Verificar que no está ya cancelada
3. **Si estaba COMPLETED:**
   - ✅ **Restaurar stock** de todos los productos
4. **Si estaba PENDING:**
   - ℹ️ No hay stock que restaurar (nunca se decrementó)
5. Cambiar estado a `CANCELLED`
6. Guardar cambios

#### 📝 Ejemplo:
```http
DELETE /sales/uuid-venta
```

#### 📊 Response:
```json
{
  "id": "uuid-venta",
  "status": "CANCELLED",
  "updatedAt": "2025-10-27T11:00:00Z",
  ...
}
```

#### 🔄 Cambios en Base de Datos (si estaba COMPLETED):
```sql
-- Sale
UPDATE sales SET 
  status = 'CANCELLED',
  updatedAt = NOW()
WHERE id = 'uuid-venta';

-- Products (por cada item) - RESTAURAR STOCK
UPDATE products SET 
  currentStock = currentStock + quantity
WHERE id = 'uuid-producto-1';
```

---

### 4️⃣ **DEVOLUCIÓN TOTAL** - `POST /sales/:id/refund`

**Estado resultante:** `REFUNDED`

#### ✅ Lo que hace (TRANSACCIÓN ATÓMICA):
1. Buscar la venta con sus detalles
2. Verificar que está en estado `COMPLETED`
3. **Restaurar stock** de todos los productos
4. Cambiar estado a `REFUNDED`
5. Guardar cambios

#### ❌ Si falla:
- Si no está completada → Error (solo se pueden devolver ventas completadas)

#### 📝 Ejemplo:
```http
POST /sales/uuid-venta/refund
```

#### 📊 Response:
```json
{
  "id": "uuid-venta",
  "status": "REFUNDED",
  "updatedAt": "2025-10-27T12:00:00Z",
  ...
}
```

#### 🔄 Cambios en Base de Datos:
```sql
-- Sale
UPDATE sales SET 
  status = 'REFUNDED',
  updatedAt = NOW()
WHERE id = 'uuid-venta';

-- Products (por cada item) - RESTAURAR STOCK
UPDATE products SET 
  currentStock = currentStock + quantity
WHERE id = 'uuid-producto-1';
```

---

## 🎭 Casos de Uso y Escenarios

### ✅ **Caso 1: Flujo Normal Exitoso**

```
1. Cliente hace pedido
   → POST /sales (PENDING)
   
2. Vendedor confirma y cobra
   → POST /sales/:id/complete (COMPLETED)
   ✅ Stock decrementado
   ✅ Comprobante generado
```

### ⚠️ **Caso 2: Cliente Cancela Antes de Confirmar**

```
1. Cliente hace pedido
   → POST /sales (PENDING)
   
2. Cliente cambia de opinión
   → DELETE /sales/:id (CANCELLED)
   ℹ️ No hay stock que restaurar (nunca se decrementó)
```

### 🔄 **Caso 3: Cliente Cancela Después de Confirmar**

```
1. Cliente hace pedido
   → POST /sales (PENDING)
   
2. Vendedor confirma y cobra
   → POST /sales/:id/complete (COMPLETED)
   ✅ Stock decrementado
   
3. Cliente cancela inmediatamente
   → DELETE /sales/:id (CANCELLED)
   ✅ Stock restaurado automáticamente
```

### 💰 **Caso 4: Cliente Devuelve Productos**

```
1. Cliente compró hace días
   → Estado: COMPLETED
   
2. Cliente devuelve productos
   → POST /sales/:id/refund (REFUNDED)
   ✅ Stock restaurado
   ✅ Estado cambiado a REFUNDED
```

### ❌ **Caso 5: Error de Stock Insuficiente**

```
1. Cliente hace pedido de 10 unidades
   → POST /sales (PENDING)
   ℹ️ No se valida stock aquí
   
2. Vendedor intenta confirmar (solo quedan 5 unidades)
   → POST /sales/:id/complete
   ❌ Error: InsufficientStockError
   ℹ️ La venta queda en PENDING
   ℹ️ Se puede editar o cancelar
```

---

## 🔒 Matriz de Transiciones de Estado

| Estado Actual | Acción | Estado Nuevo | Stock |
|--------------|--------|-------------|-------|
| `PENDING` | Completar | `COMPLETED` | ⬇️ Decrementar |
| `PENDING` | Cancelar | `CANCELLED` | - Sin cambio |
| `PENDING` | Devolver | ❌ **NO PERMITIDO** | - |
| `COMPLETED` | Completar | ❌ **NO PERMITIDO** | - |
| `COMPLETED` | Cancelar | `CANCELLED` | ⬆️ Restaurar |
| `COMPLETED` | Devolver | `REFUNDED` | ⬆️ Restaurar |
| `CANCELLED` | Cualquier acción | ❌ **NO PERMITIDO** | - |
| `REFUNDED` | Cualquier acción | ❌ **NO PERMITIDO** | - |

---

## 🛠️ Archivos Modificados

### **Use Cases**
- ✅ `create-sale.use-case.ts` - Eliminado decremento de stock y generación de número
- ✅ `complete-sale.use-case.ts` - Agregado decremento de stock y generación de número
- ✅ `cancel-sale.use-case.ts` - Agregado restauración de stock condicional
- ✅ `refund-sale.use-case.ts` - **NUEVO** - Implementación de devoluciones

### **Repositories**
- ✅ `sale.repository.ts` (interface) - Agregado `findByIdWithDetails()` y `updateWithTransaction()`
- ✅ `sale.repository.ts` (prisma) - Implementación de nuevos métodos
- ✅ `product.repository.ts` - Ya tenía `increaseStock()` y `decreaseStock()`

### **Services**
- ✅ `sale.service.ts` - Agregado inicialización de `RefundSaleUseCase`

### **Controllers**
- ✅ `sale.controller.ts` - Simplificado endpoint `/refund` (devolución total)

---

## 📊 Ventajas del Nuevo Flujo

### ✅ **Beneficios:**

1. **Mayor Flexibilidad**
   - Las ventas se pueden crear sin afectar el stock inmediatamente
   - Permite revisar o modificar antes de confirmar

2. **Mejor Control de Inventario**
   - El stock solo se afecta cuando la venta es definitiva
   - Evita bloqueos innecesarios de productos

3. **Auditoría Completa**
   - Se puede ver historial de ventas pendientes vs completadas
   - Registro claro de cuándo se afectó el stock

4. **Manejo de Errores Mejorado**
   - Si falta stock al completar, la venta queda pendiente
   - No se pierden datos si hay un error

5. **Devoluciones Implementadas**
   - Sistema completo de refund con restauración de stock
   - Trazabilidad de productos devueltos

6. **Transacciones Atómicas**
   - Todo o nada: si algo falla, se revierte completamente
   - Consistencia garantizada en la base de datos

---

## 🔮 Mejoras Futuras Sugeridas

1. **Devoluciones Parciales**
   - Permitir devolver solo algunos items de una venta
   - Crear registro de motivo de devolución

2. **Reserva de Stock**
   - Al crear venta PENDING, marcar stock como "reservado"
   - Liberar automáticamente después de X tiempo

3. **Registro de Movimientos de Inventario**
   - Tabla `InventoryMovement` para auditoría completa
   - Registrar cada cambio de stock con motivo y usuario

4. **Notificaciones**
   - Alertar cuando una venta queda pendiente por falta de stock
   - Notificar a administradores sobre devoluciones

5. **Cálculo Automático de Impuestos**
   - Integrar con SUNAT para cálculo automático de IGV
   - Aplicar reglas fiscales según tipo de cliente

---

## 🧪 Testing Recomendado

### **Casos de Prueba Críticos:**

```typescript
// Test 1: Crear venta no decrementa stock
test('Creating a sale should not decrease stock', async () => {
  const initialStock = 100;
  const sale = await createSale({ quantity: 10 });
  const product = await getProduct();
  expect(product.currentStock).toBe(initialStock); // Stock sin cambio
  expect(sale.status).toBe('PENDING');
});

// Test 2: Completar venta decrementa stock
test('Completing a sale should decrease stock', async () => {
  const sale = await createSale({ quantity: 10 });
  await completeSale(sale.id);
  const product = await getProduct();
  expect(product.currentStock).toBe(90);
});

// Test 3: Cancelar venta completada restaura stock
test('Cancelling a completed sale should restore stock', async () => {
  const sale = await createSale({ quantity: 10 });
  await completeSale(sale.id);
  await cancelSale(sale.id);
  const product = await getProduct();
  expect(product.currentStock).toBe(100); // Stock restaurado
});

// Test 4: Refund restaura stock
test('Refund should restore stock', async () => {
  const sale = await createSale({ quantity: 10 });
  await completeSale(sale.id);
  await refundSale(sale.id);
  const product = await getProduct();
  expect(product.currentStock).toBe(100); // Stock restaurado
});
```

---

## 📞 Soporte

Para preguntas o problemas con el sistema de ventas:
- Revisar esta documentación
- Verificar los logs de errores de dominio
- Consultar `domain-errors-guide.md` para errores específicos

---

**Última actualización:** 27 de Octubre, 2025  
**Versión:** 2.0 - Sistema de ventas con flujo mejorado

