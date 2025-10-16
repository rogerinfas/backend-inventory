import { Brand } from '../entities/brand.entity';
import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Interfaz del repositorio de Marcas
 */
export interface BrandRepository {
  findById(id: string): Promise<Brand | null>;
  findByName(name: string): Promise<Brand | null>;
  findMany(filters?: {
    status?: EntityStatus;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Brand[]>;
  save(brand: Brand): Promise<Brand>;
  update(brand: Brand): Promise<Brand>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: {
    status?: EntityStatus;
    search?: string;
  }): Promise<number>;
}
