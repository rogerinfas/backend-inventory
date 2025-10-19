import { CategoryResponseDto } from '../../dto/category';
import { CategoryRepository } from '../../../domain/repositories';
import { CategoryMapper } from '../../mappers';
import { CategoryNotFoundError } from '../../errors';

export class GetCategoryByIdUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string): Promise<CategoryResponseDto | null> {
    const category = await this.categoryRepository.findById(id);
    
    if (!category) {
      return null;
    }

    return CategoryMapper.toResponseDto(category);
  }
}
