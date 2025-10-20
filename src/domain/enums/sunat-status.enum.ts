/**
 * Estados de SUNAT para comprobantes electrónicos
 */
export enum SunatStatus {
  PENDING = 'PENDING',   // Pendiente
  ACCEPTED = 'ACCEPTED', // Aceptado
  REJECTED = 'REJECTED', // Rechazado
  ERROR = 'ERROR'        // Error
}
