import { StoreRepository } from '../../../domain/repositories/store.repository';
import { StoreResponseDto } from '../../dto/store';
import { StoreMapper } from '../../mappers/store.mapper';

export class GetStoreByRucUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(ruc: string): Promise<StoreResponseDto | null> {
    const store = await this.storeRepository.findByRuc(ruc);
    
    if (!store) {
      return null;
    }

    return StoreMapper.toResponseDto(store);
  }
}
