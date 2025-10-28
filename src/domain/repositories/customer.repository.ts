import { Customer } from '../entities/customer.entity';
import { EntityStatus } from '../enums/entity-status.enum';
import { PrismaTransaction } from './person.repository';

export interface CustomerQueryFilters {
  storeId?: string;
  personId?: string;
  status?: EntityStatus;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CustomerRepository {
  findById(id: string, tx?: PrismaTransaction): Promise<Customer | null>;
  findByStoreId(storeId: string, tx?: PrismaTransaction): Promise<Customer[]>;
  findByPersonId(personId: string, tx?: PrismaTransaction): Promise<Customer | null>;
  findByStoreAndPerson(storeId: string, personId: string, tx?: PrismaTransaction): Promise<Customer | null>;
  findByStoreAndDocument(storeId: string, documentNumber: string, tx?: PrismaTransaction): Promise<Customer | null>;
  findMany(filters?: CustomerQueryFilters, tx?: PrismaTransaction): Promise<Customer[]>;
  save(customer: Customer, tx?: PrismaTransaction): Promise<Customer>;
  createWithTransaction(customer: Customer, tx?: PrismaTransaction): Promise<Customer>;
  update(customer: Customer, tx?: PrismaTransaction): Promise<Customer>;
  delete(id: string, tx?: PrismaTransaction): Promise<void>;
  exists(id: string, tx?: PrismaTransaction): Promise<boolean>;
  count(filters?: CustomerQueryFilters, tx?: PrismaTransaction): Promise<number>;
  
  // Métodos para dashboard/estadísticas
  countByStatus(status: EntityStatus, storeId: string | null, tx?: PrismaTransaction): Promise<number>;
}
