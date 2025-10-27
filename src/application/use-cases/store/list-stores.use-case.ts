import { StoreRepository } from '../../../domain/repositories/store.repository';
import { StoreQueryDto, StoreResponseDto } from '../../dto/store';
import { StoreMapper } from '../../mappers/store.mapper';
import type { StoreFilter } from '../../../domain/value-objects';

export interface ListStoresResult {
  data: StoreResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListStoresUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(
    query: StoreQueryDto,
    storeFilter?: StoreFilter
  ): Promise<ListStoresResult> {
    // Si es ADMIN, solo puede ver su tienda
    if (storeFilter && storeFilter.storeId) {
      const store = await this.storeRepository.findById(storeFilter.storeId);
      if (!store) {
        return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      }
      
      const data = [StoreMapper.toResponseDto(store)];
      return { data, total: 1, page: 1, limit: 1, totalPages: 1 };
    }
    
    // SUPERADMIN: Ve todas las tiendas con filtros y paginación
    const filters = StoreMapper.toQueryFilters(query);
    const stores = await this.storeRepository.findMany(filters);
    const total = await this.storeRepository.count(filters);

    // Convertir a DTOs
    const data = stores.map(store => StoreMapper.toResponseDto(store));

    // Calcular metadatos de paginación
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
}
