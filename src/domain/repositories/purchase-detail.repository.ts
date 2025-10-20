import { PurchaseDetail } from '../entities';

export interface PurchaseDetailQueryFilters {
  purchaseId?: string;
  productId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'quantity' | 'unitPrice' | 'discount';
  sortOrder?: 'asc' | 'desc';
}

export interface PurchaseDetailRepository {
  // CRUD básico
  create(detail: PurchaseDetail): Promise<PurchaseDetail>;
  createWithTransaction(detail: PurchaseDetail, tx?: any): Promise<PurchaseDetail>;
  createMany(details: PurchaseDetail[]): Promise<PurchaseDetail[]>;
  createManyWithTransaction(details: PurchaseDetail[], tx?: any): Promise<PurchaseDetail[]>;
  findById(id: string): Promise<PurchaseDetail | null>;
  update(detail: PurchaseDetail): Promise<PurchaseDetail>;
  delete(id: string): Promise<void>;

  // Consultas por compra
  findByPurchaseId(purchaseId: string): Promise<PurchaseDetail[]>;
  findByPurchaseIdWithTransaction(purchaseId: string, tx?: any): Promise<PurchaseDetail[]>;
  deleteByPurchaseId(purchaseId: string): Promise<void>;
  deleteByPurchaseIdWithTransaction(purchaseId: string, tx?: any): Promise<void>;

  // Consultas por producto
  findByProductId(productId: string, page?: number, limit?: number): Promise<PurchaseDetail[]>;
  findByProductIdAndDateRange(productId: string, startDate: Date, endDate: Date): Promise<PurchaseDetail[]>;

  // Consultas complejas
  findByFilters(filters: PurchaseDetailQueryFilters): Promise<PurchaseDetail[]>;
  countByFilters(filters: PurchaseDetailQueryFilters): Promise<number>;

  // Estadísticas
  getTotalQuantityByProduct(productId: string, startDate?: Date, endDate?: Date): Promise<number>;
  getTotalAmountByProduct(productId: string, startDate?: Date, endDate?: Date): Promise<number>;
  getAveragePriceByProduct(productId: string, startDate?: Date, endDate?: Date): Promise<number>;
}
