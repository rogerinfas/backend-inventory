import { StoreRepository } from '../../../domain/repositories/store.repository';
import { StoreResponseDto } from '../../dto/store';
import { StoreMapper } from '../../mappers/store.mapper';
import { StoreNotFoundError, StoreDeletedError } from '../../errors/domain-errors';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class DeleteStoreUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(id: string): Promise<StoreResponseDto> {
    // 1. Buscar tienda existente
    const existingStore = await this.storeRepository.findById(id);
    if (!existingStore) {
      throw new StoreNotFoundError(id);
    }

    // 2. Verificar que no esté ya eliminada
    if (existingStore.isDeleted()) {
      throw new StoreDeletedError(id);
    }

    // 3. Aplicar soft delete
    StoreMapper.applyStatusChange(existingStore, EntityStatus.DELETED);

    // 4. Guardar y retornar
    const savedStore = await this.storeRepository.update(existingStore);
    return StoreMapper.toResponseDto(savedStore);
  }
}
