import { Supplier } from '../entities/supplier.entity';
import { EntityStatus } from '../enums/entity-status.enum';

export interface SupplierQueryFilters {
  storeId?: string;
  personId?: string;
  status?: EntityStatus;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SupplierRepository {
  findById(id: string): Promise<Supplier | null>;
  findByStoreId(storeId: string): Promise<Supplier[]>;
  findByPersonId(personId: string): Promise<Supplier | null>;
  findByStoreAndPerson(storeId: string, personId: string): Promise<Supplier | null>;
  findMany(filters?: SupplierQueryFilters): Promise<Supplier[]>;
  save(supplier: Supplier): Promise<Supplier>;
  update(supplier: Supplier): Promise<Supplier>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: SupplierQueryFilters): Promise<number>;
}
