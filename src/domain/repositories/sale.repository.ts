import { Sale } from '../entities/sale.entity';
import { SaleDetail } from '../entities/sale-detail.entity';

export interface SaleQueryFilters {
  storeId?: string;
  customerId?: string;
  userId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SaleWithDetails {
  sale: Sale;
  details: SaleDetail[];
}

export interface SaleRepository {
  findById(id: string): Promise<Sale | null>;
  findByStoreId(storeId: string): Promise<Sale[]>;
  findByCustomerId(customerId: string): Promise<Sale[]>;
  findByUserId(userId: string): Promise<Sale[]>;
  findByDocumentNumber(documentNumber: string): Promise<Sale | null>;
  findMany(filters: SaleQueryFilters): Promise<Sale[]>;
  save(sale: Sale): Promise<Sale>;
  update(sale: Sale): Promise<Sale>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  existsByDocumentNumber(documentNumber: string): Promise<boolean>;
  count(filters: SaleQueryFilters): Promise<number>;
  
  // Métodos para creación atómica
  createWithDetailsTransaction(sale: Sale, details: SaleDetail[], tx?: any): Promise<SaleWithDetails>;
}
