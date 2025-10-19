import { Category } from '../../domain/entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto, CategoryQueryDto } from '../dto/category';
import { CategoryQueryFilters } from '../../domain/repositories/category.repository';

export class CategoryMapper {
  // DTO → Entidad
  static toDomain(dto: CreateCategoryDto, id: string): Category {
    return Category.create(
      id,
      dto.name,
      dto.description
    );
  }

  // Entidad → DTO de respuesta
  static toResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      status: category.status,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  // Aplicar actualizaciones a entidad existente
  static toUpdateDomain(dto: UpdateCategoryDto, existingCategory: Category): Category {
    if (!this.validateUpdateDto(dto)) {
      throw new Error('No hay campos válidos para actualizar');
    }

    if (dto.name !== undefined) {
      existingCategory.updateName(dto.name);
    }
    if (dto.description !== undefined) {
      existingCategory.updateDescription(dto.description);
    }

    return existingCategory;
  }

  // DTO de consulta → Filtros del repositorio
  static toQueryFilters(query: CategoryQueryDto): CategoryQueryFilters {
    return {
      status: query.status,
      search: query.search,
      offset: query.page ? (query.page - 1) * (query.limit || 10) : 0,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: query.sortOrder || 'desc',
    };
  }

  // Validar DTO de actualización
  static validateUpdateDto(dto: UpdateCategoryDto): boolean {
    const fields = Object.keys(dto) as (keyof UpdateCategoryDto)[];
    return fields.some(field => {
      const value = dto[field];
      return value !== undefined && value !== null && value !== '';
    });
  }
}
