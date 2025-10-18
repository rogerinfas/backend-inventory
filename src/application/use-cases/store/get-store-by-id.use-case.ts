import { StoreRepository } from '../../../domain/repositories/store.repository';
import { StoreResponseDto } from '../../dto/store';
import { StoreMapper } from '../../mappers/store.mapper';
import { StoreNotFoundError } from '../../errors/domain-errors';

export class GetStoreByIdUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(id: string): Promise<StoreResponseDto | null> {
    const store = await this.storeRepository.findById(id);
    
    if (!store) {
      return null;
    }

    return StoreMapper.toResponseDto(store);
  }
}
