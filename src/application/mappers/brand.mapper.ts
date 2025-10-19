import { Brand } from '../../domain/entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto, BrandResponseDto, BrandQueryDto } from '../dto/brand';
import { BrandQueryFilters } from '../../domain/repositories/brand.repository';

export class BrandMapper {
  // DTO → Entidad
  static toDomain(dto: CreateBrandDto, id: string): Brand {
    return Brand.create(
      id,
      dto.name
    );
  }

  // Entidad → DTO de respuesta
  static toResponseDto(brand: Brand): BrandResponseDto {
    return {
      id: brand.id,
      name: brand.name,
      status: brand.status,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
    };
  }

  // Aplicar actualizaciones a entidad existente
  static toUpdateDomain(dto: UpdateBrandDto, existingBrand: Brand): Brand {
    if (!this.validateUpdateDto(dto)) {
      throw new Error('No hay campos válidos para actualizar');
    }

    if (dto.name !== undefined) {
      existingBrand.updateName(dto.name);
    }

    return existingBrand;
  }

  // DTO de consulta → Filtros del repositorio
  static toQueryFilters(query: BrandQueryDto): BrandQueryFilters {
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
  static validateUpdateDto(dto: UpdateBrandDto): boolean {
    const fields = Object.keys(dto) as (keyof UpdateBrandDto)[];
    return fields.some(field => {
      const value = dto[field];
      return value !== undefined && value !== null && value !== '';
    });
  }
}
