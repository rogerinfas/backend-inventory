import { Category } from '../entities/category.entity';

export interface CategoryQueryFilters {
  status?: string;
  search?: string;
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findMany(filters?: CategoryQueryFilters): Promise<Category[]>;
  save(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: CategoryQueryFilters): Promise<number>;
}
