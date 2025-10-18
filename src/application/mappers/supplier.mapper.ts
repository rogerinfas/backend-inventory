import { Supplier } from '../../domain/entities/supplier.entity';
import { CreateSupplierDto, SupplierResponseDto, SupplierQueryDto } from '../dto/supplier';
import { SupplierQueryFilters } from '../../domain/repositories/supplier.repository';

export class SupplierMapper {
  // DTO → Entidad
  static toDomain(dto: CreateSupplierDto, id: string): Supplier {
    return Supplier.create(
      id,
      dto.storeId,
      dto.personId,
    );
  }

  // Entidad → DTO de respuesta
  static toResponseDto(supplier: Supplier): SupplierResponseDto {
    return {
      id: supplier.id,
      storeId: supplier.storeId,
      personId: supplier.personId,
      status: supplier.status,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    };
  }

  // DTO de consulta → Filtros de repositorio
  static toQueryFilters(dto: SupplierQueryDto): SupplierQueryFilters {
    return {
      storeId: dto.storeId,
      personId: dto.personId,
      status: dto.status,
      search: dto.search,
      limit: dto.limit,
      offset: dto.page ? (dto.page - 1) * (dto.limit || 10) : undefined,
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
    };
  }

  // Múltiples entidades → DTOs de respuesta
  static toResponseDtoList(suppliers: Supplier[]): SupplierResponseDto[] {
    return suppliers.map(supplier => this.toResponseDto(supplier));
  }
}
