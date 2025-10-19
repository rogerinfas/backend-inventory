import { UpdateCategoryDto, CategoryResponseDto } from '../../dto/category';
import { CategoryRepository } from '../../../domain/repositories';
import { CategoryMapper } from '../../mappers';
import { CategoryNotFoundError, CategoryDeletedError, CategoryAlreadyExistsError } from '../../errors';

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    // Buscar categoría existente
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new CategoryNotFoundError(id);
    }

    // Verificar que no esté eliminada
    if (existingCategory.isDeleted()) {
      throw new CategoryDeletedError(id);
    }

    // Verificar nombre único si se actualiza
    if (dto.name && dto.name !== existingCategory.name) {
      const existingName = await this.categoryRepository.findByName(dto.name);
      if (existingName && existingName.id !== id) {
        throw new CategoryAlreadyExistsError('nombre', dto.name);
      }
    }

    // Aplicar actualizaciones
    const updatedCategory = CategoryMapper.toUpdateDomain(dto, existingCategory);

    // Guardar y retornar
    const savedCategory = await this.categoryRepository.update(updatedCategory);
    return CategoryMapper.toResponseDto(savedCategory);
  }
}
