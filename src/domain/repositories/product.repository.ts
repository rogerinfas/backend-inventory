import { Product } from '../entities/product.entity';
import { UnitOfMeasure } from '../enums/unit-of-measure.enum';

/**
 * Interfaz del repositorio de Productos
 */
export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySKU(sku: string): Promise<Product | null>;
  findByStoreId(storeId: string): Promise<Product[]>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  findByBrandId(brandId: string): Promise<Product[]>;
  findLowStock(storeId: string): Promise<Product[]>;
  findOutOfStock(storeId: string): Promise<Product[]>;
  findMany(filters?: {
    storeId?: string;
    categoryId?: string;
    brandId?: string;
    unitOfMeasure?: UnitOfMeasure;
    isActive?: boolean;
    lowStock?: boolean;
    outOfStock?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: {
    storeId?: string;
    categoryId?: string;
    brandId?: string;
    unitOfMeasure?: UnitOfMeasure;
    isActive?: boolean;
    lowStock?: boolean;
    outOfStock?: boolean;
    search?: string;
  }): Promise<number>;
}
