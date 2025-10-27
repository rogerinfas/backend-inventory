import { ForbiddenException } from '@nestjs/common';
import { StoreRepository } from '../../../domain/repositories/store.repository';
import { StoreResponseDto } from '../../dto/store';
import { StoreMapper } from '../../mappers/store.mapper';
import { StoreNotFoundError } from '../../errors/domain-errors';
import type { StoreFilter } from '../../../domain/value-objects';

export class GetStoreByIdUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(
    id: string,
    storeFilter?: StoreFilter
  ): Promise<StoreResponseDto | null> {
    const store = await this.storeRepository.findById(id);
    
    if (!store) {
      return null;
    }

    // Validar que el ADMIN solo pueda ver su tienda
    // SUPERADMIN puede ver cualquier tienda
    if (storeFilter && storeFilter.storeId && store.id !== storeFilter.storeId) {
      throw new ForbiddenException(
        'No tiene permisos para acceder a esta tienda'
      );
    }

    return StoreMapper.toResponseDto(store);
  }
}
