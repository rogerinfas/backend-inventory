import { SunatConfig } from '../entities/sunat-config.entity';

/**
 * Filtros para consultas de SunatConfig
 */
export interface SunatConfigQueryFilters {
  storeId?: string;
  environment?: string;
  search?: string;
}

/**
 * Interfaz del repositorio para SunatConfig
 */
export interface SunatConfigRepository {
  findById(id: string): Promise<SunatConfig | null>;
  findByStoreId(storeId: string): Promise<SunatConfig | null>;
  findMany(filters?: SunatConfigQueryFilters): Promise<SunatConfig[]>;
  save(sunatConfig: SunatConfig): Promise<SunatConfig>;
  update(sunatConfig: SunatConfig): Promise<SunatConfig>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  existsByStoreId(storeId: string): Promise<boolean>;
  count(filters?: SunatConfigQueryFilters): Promise<number>;
}
