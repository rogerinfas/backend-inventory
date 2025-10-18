import { StoreRepository } from '../../../domain/repositories/store.repository';
import { UpdateStoreDto, StoreResponseDto } from '../../dto/store';
import { StoreMapper } from '../../mappers/store.mapper';
import { StoreNotFoundError, StoreDeletedError, StoreAlreadyExistsError } from '../../errors/domain-errors';

export class UpdateStoreUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(id: string, dto: UpdateStoreDto): Promise<StoreResponseDto> {
    // 1. Buscar tienda existente
    const existingStore = await this.storeRepository.findById(id);
    if (!existingStore) {
      throw new StoreNotFoundError(id);
    }

    // 2. Verificar que no esté eliminada
    if (existingStore.isDeleted()) {
      throw new StoreDeletedError(id);
    }

    // 3. Verificar email único si se actualiza
    if (dto.email && dto.email !== existingStore.email) {
      const existingStoreByEmail = await this.storeRepository.findByEmail(dto.email);
      if (existingStoreByEmail && existingStoreByEmail.id !== id) {
        throw new StoreAlreadyExistsError('email', dto.email);
      }
    }

    // 4. Aplicar actualizaciones
    const updatedStore = StoreMapper.toUpdateDomain(dto, existingStore);

    // 5. Guardar y retornar
    const savedStore = await this.storeRepository.update(updatedStore);
    return StoreMapper.toResponseDto(savedStore);
  }
}
