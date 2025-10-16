import { Category } from '../entities/category.entity';
import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Interfaz del repositorio de Categorías
 */
export interface CategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findMany(filters?: {
    status?: EntityStatus;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Category[]>;
  save(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: {
    status?: EntityStatus;
    search?: string;
  }): Promise<number>;
}
