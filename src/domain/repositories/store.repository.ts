import { Store } from '../entities/store.entity';
import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Interfaz del repositorio de Tiendas
 */
export interface StoreRepository {
  findById(id: string): Promise<Store | null>;
  findByRUC(ruc: string): Promise<Store | null>;
  findMany(filters?: {
    status?: EntityStatus;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Store[]>;
  save(store: Store): Promise<Store>;
  update(store: Store): Promise<Store>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: {
    status?: EntityStatus;
    search?: string;
  }): Promise<number>;
}
