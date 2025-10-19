import { ChangeCategoryStatusDto, CategoryResponseDto } from '../../dto/category';
import { CategoryRepository } from '../../../domain/repositories';
import { CategoryMapper } from '../../mappers';
import { CategoryNotFoundError, CategoryDeletedError } from '../../errors';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class ChangeCategoryStatusUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string, dto: ChangeCategoryStatusDto): Promise<CategoryResponseDto> {
    // Buscar categoría existente
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new CategoryNotFoundError(id);
    }

    // Verificar que no esté eliminada (excepto si queremos eliminarla)
    if (existingCategory.isDeleted() && dto.status !== EntityStatus.DELETED) {
      throw new CategoryDeletedError(id);
    }

    // Aplicar cambio de estado
    switch (dto.status) {
      case EntityStatus.ACTIVE:
        existingCategory.activate();
        break;
      case EntityStatus.INACTIVE:
        existingCategory.deactivate();
        break;
      case EntityStatus.SUSPENDED:
        existingCategory.suspend();
        break;
      case EntityStatus.DELETED:
        existingCategory.delete();
        break;
    }

    // Guardar y retornar
    const savedCategory = await this.categoryRepository.update(existingCategory);
    return CategoryMapper.toResponseDto(savedCategory);
  }
}
