import { Customer } from '../entities/customer.entity';
import { EntityStatus } from '../enums/entity-status.enum';

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
  findById(id: string): Promise<Customer | null>;
  findByStoreId(storeId: string): Promise<Customer[]>;
  findByPersonId(personId: string): Promise<Customer | null>;
  findByStoreAndPerson(storeId: string, personId: string): Promise<Customer | null>;
  findMany(filters?: CustomerQueryFilters): Promise<Customer[]>;
  save(customer: Customer): Promise<Customer>;
  update(customer: Customer): Promise<Customer>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: CustomerQueryFilters): Promise<number>;
}
