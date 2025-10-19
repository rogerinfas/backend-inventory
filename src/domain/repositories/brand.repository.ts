import { Brand } from '../entities/brand.entity';

export interface BrandQueryFilters {
  status?: string;
  search?: string;
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BrandRepository {
  findById(id: string): Promise<Brand | null>;
  findByName(name: string): Promise<Brand | null>;
  findMany(filters?: BrandQueryFilters): Promise<Brand[]>;
  save(brand: Brand): Promise<Brand>;
  update(brand: Brand): Promise<Brand>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: BrandQueryFilters): Promise<number>;
}
