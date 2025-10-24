import { Store } from '../../domain/entities/store.entity';
import { EntityStatus } from '../../domain/enums/entity-status.enum';
import { CreateStoreDto, UpdateStoreDto, StoreResponseDto, StoreQueryDto } from '../dto/store';
import { StoreQueryFilters } from '../../domain/repositories/store.repository';

export class StoreMapper {
  /**
   * Convierte CreateStoreDto a entidad Store
   */
  static toDomain(dto: CreateStoreDto, id: string): Store {
    return Store.create(
      id,
      dto.businessName,
      dto.ruc,
      dto.address,
      dto.phone,
      dto.logoUrl
    );
  }

  /**
   * Convierte entidad Store a StoreResponseDto
   */
  static toResponseDto(store: Store): StoreResponseDto {
    return {
      id: store.id,
      businessName: store.businessName,
      ruc: store.ruc,
      address: store.address,
      phone: store.phone,
      logoUrl: store.logoUrl,
      status: store.status,
      registeredAt: store.registeredAt,
      updatedAt: store.updatedAt,
    };
  }

  /**
   * Aplica actualizaciones de UpdateStoreDto a una entidad Store existente
   */
  static toUpdateDomain(dto: UpdateStoreDto, existingStore: Store): Store {
    if (!this.validateUpdateDto(dto)) {
      throw new Error('No hay campos válidos para actualizar');
    }

    if (dto.businessName !== undefined) {
      existingStore.updateBusinessName(dto.businessName);
    }
    if (dto.address !== undefined) {
      existingStore.updateAddress(dto.address);
    }
    if (dto.phone !== undefined) {
      existingStore.updatePhone(dto.phone);
    }
    if (dto.logoUrl !== undefined) {
      existingStore.updateLogoUrl(dto.logoUrl);
    }

    return existingStore;
  }

  /**
   * Convierte StoreQueryDto a StoreQueryFilters
   */
  static toQueryFilters(query: StoreQueryDto): StoreQueryFilters {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    return {
      status: query.status,
      search: query.search,
      limit,
      offset,
      sortBy: query.sortBy || 'businessName',
      sortOrder: query.sortOrder || 'asc',
    };
  }

  /**
   * Valida que el DTO de actualización tenga al menos un campo válido
   */
  static validateUpdateDto(dto: UpdateStoreDto): boolean {
    const fields = Object.keys(dto) as (keyof UpdateStoreDto)[];
    return fields.some(field => {
      const value = dto[field];
      return value !== undefined && value !== null && value !== '';
    });
  }

  /**
   * Aplica cambio de estado a una entidad Store
   */
  static applyStatusChange(store: Store, status: EntityStatus): void {
    switch (status) {
      case EntityStatus.ACTIVE:
        store.activate();
        break;
      case EntityStatus.INACTIVE:
        store.deactivate();
        break;
      case EntityStatus.SUSPENDED:
        store.suspend();
        break;
      case EntityStatus.DELETED:
        store.delete();
        break;
      default:
        throw new Error(`Estado no válido: ${status}`);
    }
  }
}
