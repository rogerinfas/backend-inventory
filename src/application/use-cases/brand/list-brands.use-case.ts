import { BrandQueryDto, BrandResponseDto } from '../../dto/brand';
import { BrandRepository } from '../../../domain/repositories';
import { BrandMapper } from '../../mappers';

export interface ListBrandsResult {
  data: BrandResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListBrandsUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(query: BrandQueryDto): Promise<ListBrandsResult> {
    const filters = BrandMapper.toQueryFilters(query);
    
    // Obtener datos paginados
    const brands = await this.brandRepository.findMany(filters);
    const total = await this.brandRepository.count(filters);

    // Convertir a DTOs
    const data = brands.map(brand => BrandMapper.toResponseDto(brand));

    // Calcular metadatos de paginación
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
}
