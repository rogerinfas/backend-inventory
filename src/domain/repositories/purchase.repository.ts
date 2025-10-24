import { Purchase, PurchaseDetail } from '../entities';
import { PurchaseStatus, PurchaseDocumentType } from '../enums';

export interface PurchaseQueryFilters {
  storeId?: string;
  supplierId?: string;
  userId?: string;
  status?: PurchaseStatus;
  documentType?: PurchaseDocumentType;
  startDate?: Date;
  endDate?: Date;
  documentNumber?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'purchaseDate' | 'total' | 'status' | 'registeredAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PurchaseWithDetails {
  purchase: Purchase;
  details: PurchaseDetail[];
}

export interface PurchaseRepository {
  // CRUD básico
  create(purchase: Purchase): Promise<Purchase>;
  createWithTransaction(purchase: Purchase, tx?: any): Promise<Purchase>;
  findById(id: string): Promise<Purchase | null>;
  findByStoreAndDocument(storeId: string, documentNumber: string): Promise<Purchase | null>;
  update(purchase: Purchase): Promise<Purchase>;
  delete(id: string): Promise<void>;

  // Consultas complejas
  findByFilters(filters: PurchaseQueryFilters): Promise<Purchase[]>;
  findByStore(storeId: string, page?: number, limit?: number): Promise<Purchase[]>;
  findBySupplier(supplierId: string, page?: number, limit?: number): Promise<Purchase[]>;
  findByUser(userId: string, page?: number, limit?: number): Promise<Purchase[]>;
  findByDateRange(storeId: string, startDate: Date, endDate: Date): Promise<Purchase[]>;

  // Conteos y estadísticas
  countByFilters(filters: PurchaseQueryFilters): Promise<number>;
  getTotalAmountByStore(storeId: string, startDate?: Date, endDate?: Date): Promise<number>;
  getTotalAmountBySupplier(supplierId: string, startDate?: Date, endDate?: Date): Promise<number>;

  // Operaciones con detalles
  createWithDetails(purchase: Purchase, details: PurchaseDetail[]): Promise<PurchaseWithDetails>;
  createWithDetailsTransaction(purchase: Purchase, details: PurchaseDetail[], tx?: any): Promise<PurchaseWithDetails>;
  findWithDetails(id: string): Promise<PurchaseWithDetails | null>;
  updateDetails(purchaseId: string, details: PurchaseDetail[]): Promise<void>;
}
