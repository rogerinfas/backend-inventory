import { Sale } from '../entities';

export interface SaleQueryFilters {
  storeId?: string;
  customerId?: string;
  userId?: string;
  status?: string;
  documentType?: string;
  startDate?: Date;
  endDate?: Date;
  documentNumber?: string;
  series?: string;
  search?: string;
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SaleWithDetails {
  sale: Sale;
  details: any[];
}

export interface SaleRepository {
  findById(id: string): Promise<Sale | null>;
  findByStoreAndDocument(storeId: string, documentNumber: string): Promise<Sale | null>;
  findByFilters(filters?: SaleQueryFilters): Promise<Sale[]>;
  countByFilters(filters?: SaleQueryFilters): Promise<number>;
  save(sale: Sale): Promise<Sale>;
  update(sale: Sale): Promise<Sale>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  existsByStoreAndDocument(storeId: string, documentNumber: string): Promise<boolean>;
  
  // Métodos para transacciones atómicas
  createWithDetailsTransaction(
    sale: Sale, 
    details: any[], 
    tx?: any
  ): Promise<SaleWithDetails>;
  
  // Métodos para gestión de series
  getNextDocumentNumber(storeId: string, documentType: string, series: string): Promise<string>;
  incrementDocumentNumber(storeId: string, documentType: string, series: string, tx?: any): Promise<void>;
}
