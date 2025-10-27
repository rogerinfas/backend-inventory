import { Injectable, Inject } from '@nestjs/common';
import { Category } from '../../../domain/entities/category.entity';
import { CreateCategoryDto, CategoryResponseDto } from '../../dto/category';
import type { CategoryRepository } from '../../../domain/repositories';
import { CategoryMapper } from '../../mappers';
import { CategoryAlreadyExistsError } from '../../errors';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    // Verificar que no exista otra categoría con el mismo nombre
    const existingCategory = await this.categoryRepository.findByName(dto.name);
    if (existingCategory) {
      throw new CategoryAlreadyExistsError('nombre', dto.name);
    }

    // Generar ID único
    const id = crypto.randomUUID();

    // Crear la entidad Category
    const category = CategoryMapper.toDomain(dto, id);

    // Guardar en el repositorio
    const savedCategory = await this.categoryRepository.save(category);

    // Retornar DTO de respuesta
    return CategoryMapper.toResponseDto(savedCategory);
  }
}
