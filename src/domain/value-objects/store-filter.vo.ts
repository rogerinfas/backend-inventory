import { UserRole } from '../enums/user-role.enum';

/**
 * Value Object que representa el filtro de tienda aplicado a las consultas
 * según el rol del usuario autenticado.
 * 
 * Este VO es utilizado por los use-cases para determinar si deben filtrar
 * los resultados por storeId o mostrar todos los registros.
 */
export interface StoreFilter {
  /**
   * ID de la tienda a filtrar.
   * - null: Sin filtro (SUPERADMIN ve todo)
   * - string: Filtrar por esta tienda específica (ADMIN/SELLER)
   */
  storeId: string | null;
  
  /**
   * Rol del usuario que realiza la consulta
   */
  role: UserRole;
  
  /**
   * Indica si el usuario es SUPERADMIN.
   * Útil para lógicas de negocio que necesiten este check rápido.
   */
  isSuperAdmin: boolean;
}

