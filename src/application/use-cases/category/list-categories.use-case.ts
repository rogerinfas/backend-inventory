import { CategoryQueryDto, CategoryResponseDto } from '../../dto/category';
import { CategoryRepository } from '../../../domain/repositories';
import { CategoryMapper } from '../../mappers';

export interface ListCategoriesResult {
  data: CategoryResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(query: CategoryQueryDto): Promise<ListCategoriesResult> {
    const filters = CategoryMapper.toQueryFilters(query);
    
    // Obtener datos paginados
    const categories = await this.categoryRepository.findMany(filters);
    const total = await this.categoryRepository.count(filters);

    // Convertir a DTOs
    const data = categories.map(category => CategoryMapper.toResponseDto(category));

    // Calcular metadatos de paginación
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
}
