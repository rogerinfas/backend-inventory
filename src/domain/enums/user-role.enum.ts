/**
 * Roles de usuario en el sistema
 */
export enum UserRole {
  SUPERADMIN = 'SUPERADMIN', /// Super Administrador (administrador de todo el sitio)
  ADMIN = 'ADMIN',           /// Administrador de tienda
  SELLER = 'SELLER',         /// Vendedor (trabajadores que se encargan de compras, ventas, caja, etc.)
}
