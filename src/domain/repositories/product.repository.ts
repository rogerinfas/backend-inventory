import { Product } from '../entities/product.entity';

export interface ProductQueryFilters {
  storeId?: string;
  categoryId?: string;
  brandId?: string;
  isActive?: boolean;
  search?: string;
  lowStock?: boolean;
  outOfStock?: boolean;
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findByStoreId(storeId: string): Promise<Product[]>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  findByBrandId(brandId: string): Promise<Product[]>;
  findMany(filters?: ProductQueryFilters): Promise<Product[]>;
  findLowStockProducts(storeId?: string): Promise<Product[]>;
  findOutOfStockProducts(storeId?: string): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  existsBySku(sku: string): Promise<boolean>;
  count(filters?: ProductQueryFilters): Promise<number>;
}
