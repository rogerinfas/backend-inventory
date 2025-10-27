import { StoreRepository } from '../../../domain/repositories/store.repository';
import { StoreResponseDto } from '../../dto/store';
import { StoreMapper } from '../../mappers/store.mapper';
import { ResourceAccessDeniedError } from '../../errors/domain-errors';
import type { StoreFilter } from '../../../domain/value-objects';

export class GetStoreByRucUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(
    ruc: string,
    storeFilter?: StoreFilter
  ): Promise<StoreResponseDto | null> {
    const store = await this.storeRepository.findByRuc(ruc);
    
    if (!store) {
      return null;
    }

    // Validar que el ADMIN solo pueda ver su tienda
    // SUPERADMIN puede ver cualquier tienda
    if (storeFilter && storeFilter.storeId && store.id !== storeFilter.storeId) {
      throw new ResourceAccessDeniedError('tienda');
    }

    return StoreMapper.toResponseDto(store);
  }
}
