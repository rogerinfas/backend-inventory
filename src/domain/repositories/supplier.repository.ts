import { Supplier } from '../entities/supplier.entity';
import { EntityStatus } from '../enums/entity-status.enum';
import { PrismaTransaction } from './person.repository';

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
  findById(id: string, tx?: PrismaTransaction): Promise<Supplier | null>;
  findByStoreId(storeId: string, tx?: PrismaTransaction): Promise<Supplier[]>;
  findByPersonId(personId: string, tx?: PrismaTransaction): Promise<Supplier | null>;
  findByStoreAndPerson(storeId: string, personId: string, tx?: PrismaTransaction): Promise<Supplier | null>;
  findByStoreAndDocument(storeId: string, documentNumber: string, tx?: PrismaTransaction): Promise<Supplier | null>;
  findMany(filters?: SupplierQueryFilters, tx?: PrismaTransaction): Promise<Supplier[]>;
  save(supplier: Supplier, tx?: PrismaTransaction): Promise<Supplier>;
  createWithTransaction(supplier: Supplier, tx?: PrismaTransaction): Promise<Supplier>;
  update(supplier: Supplier, tx?: PrismaTransaction): Promise<Supplier>;
  delete(id: string, tx?: PrismaTransaction): Promise<void>;
  exists(id: string, tx?: PrismaTransaction): Promise<boolean>;
  count(filters?: SupplierQueryFilters, tx?: PrismaTransaction): Promise<number>;
}
