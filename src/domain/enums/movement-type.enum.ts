/**
 * Tipos de movimientos de inventario
 */
export enum MovementType {
  ENTRY = 'ENTRY',         // Entrada
  EXIT = 'EXIT',           // Salida
  ADJUSTMENT = 'ADJUSTMENT', // Ajuste
  RETURN = 'RETURN',       // Devolución
  TRANSFER = 'TRANSFER',   // Transferencia
  LOSS = 'LOSS'            // Pérdida
}
