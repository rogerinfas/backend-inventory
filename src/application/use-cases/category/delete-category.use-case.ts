import { CategoryResponseDto } from '../../dto/category';
import { CategoryRepository } from '../../../domain/repositories';
import { CategoryMapper } from '../../mappers';
import { CategoryNotFoundError, CategoryDeletedError } from '../../errors';

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string): Promise<CategoryResponseDto> {
    // Buscar categoría existente
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new CategoryNotFoundError(id);
    }

    // Verificar que no esté ya eliminada
    if (existingCategory.isDeleted()) {
      throw new CategoryDeletedError(id);
    }

    // Aplicar soft delete
    existingCategory.delete();

    // Guardar y retornar
    const savedCategory = await this.categoryRepository.update(existingCategory);
    return CategoryMapper.toResponseDto(savedCategory);
  }
}
