import { Customer } from '../entities/customer.entity';
import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Interfaz del repositorio de Clientes
 */
export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByStoreId(storeId: string): Promise<Customer[]>;
  findByPersonId(personId: string): Promise<Customer | null>;
  findMany(filters?: {
    storeId?: string;
    status?: EntityStatus;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Customer[]>;
  save(customer: Customer): Promise<Customer>;
  update(customer: Customer): Promise<Customer>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: {
    storeId?: string;
    status?: EntityStatus;
    search?: string;
  }): Promise<number>;
}
