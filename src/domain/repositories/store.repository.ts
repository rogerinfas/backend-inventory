import { Store } from '../entities/store.entity';
import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Filtros para consultas de tiendas
 */
export interface StoreQueryFilters {
  status?: EntityStatus;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'businessName' | 'legalName' | 'registeredAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Interfaz del repositorio para la entidad Store
 */
export interface StoreRepository {
  /**
   * Buscar una tienda por su ID
   * @param id - ID único de la tienda
   * @returns La tienda encontrada o null si no existe
   */
  findById(id: string): Promise<Store | null>;

  /**
   * Buscar una tienda por su RUC
   * @param ruc - RUC de la tienda
   * @returns La tienda encontrada o null si no existe
   */
  findByRuc(ruc: string): Promise<Store | null>;

  /**
   * Buscar una tienda por su email
   * @param email - Email de la tienda
   * @returns La tienda encontrada o null si no existe
   */
  findByEmail(email: string): Promise<Store | null>;

  /**
   * Buscar múltiples tiendas con filtros opcionales
   * @param filters - Filtros de búsqueda
   * @returns Lista de tiendas que coinciden con los filtros
   */
  findMany(filters?: StoreQueryFilters): Promise<Store[]>;

  /**
   * Guardar una nueva tienda
   * @param store - Entidad Store a guardar
   * @returns La tienda guardada
   */
  save(store: Store): Promise<Store>;

  /**
   * Actualizar una tienda existente
   * @param store - Entidad Store actualizada
   * @returns La tienda actualizada
   */
  update(store: Store): Promise<Store>;

  /**
   * Eliminar una tienda por ID
   * @param id - ID de la tienda a eliminar
   */
  delete(id: string): Promise<void>;

  /**
   * Verificar si una tienda existe
   * @param id - ID de la tienda
   * @returns true si existe, false si no
   */
  exists(id: string): Promise<boolean>;

  /**
   * Contar tiendas que coinciden con los filtros
   * @param filters - Filtros de búsqueda
   * @returns Número total de tiendas que coinciden
   */
  count(filters?: StoreQueryFilters): Promise<number>;
}
