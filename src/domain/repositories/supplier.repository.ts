import { Supplier } from '../entities/supplier.entity';
import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Interfaz del repositorio de Proveedores
 */
export interface SupplierRepository {
  findById(id: string): Promise<Supplier | null>;
  findByStoreId(storeId: string): Promise<Supplier[]>;
  findByPersonId(personId: string): Promise<Supplier | null>;
  findMany(filters?: {
    storeId?: string;
    status?: EntityStatus;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Supplier[]>;
  save(supplier: Supplier): Promise<Supplier>;
  update(supplier: Supplier): Promise<Supplier>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: {
    storeId?: string;
    status?: EntityStatus;
    search?: string;
  }): Promise<number>;
}
