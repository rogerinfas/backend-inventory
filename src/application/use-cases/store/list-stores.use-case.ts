import { StoreRepository } from '../../../domain/repositories/store.repository';
import { StoreQueryDto, StoreResponseDto } from '../../dto/store';
import { StoreMapper } from '../../mappers/store.mapper';

export interface ListStoresResult {
  data: StoreResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListStoresUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(query: StoreQueryDto): Promise<ListStoresResult> {
    const filters = StoreMapper.toQueryFilters(query);
    
    // Obtener datos paginados
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
