import { StoreRepository } from '../../../domain/repositories/store.repository';
import { ChangeStoreStatusDto, StoreResponseDto } from '../../dto/store';
import { StoreMapper } from '../../mappers/store.mapper';
import { StoreNotFoundError, StoreDeletedError, InvalidStatusChangeError } from '../../errors/domain-errors';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class ChangeStoreStatusUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(id: string, dto: ChangeStoreStatusDto): Promise<StoreResponseDto> {
    // 1. Buscar tienda existente
    const existingStore = await this.storeRepository.findById(id);
    if (!existingStore) {
      throw new StoreNotFoundError(id);
    }

    // 2. Verificar que no esté eliminada
    if (existingStore.isDeleted()) {
      throw new StoreDeletedError(id);
    }

    // 3. Validar cambio de estado
    this.validateStatusChange(existingStore.status, dto.status);

    // 4. Aplicar cambio de estado
    StoreMapper.applyStatusChange(existingStore, dto.status);

    // 5. Guardar y retornar
    const savedStore = await this.storeRepository.update(existingStore);
    return StoreMapper.toResponseDto(savedStore);
  }

  private validateStatusChange(currentStatus: EntityStatus, newStatus: EntityStatus): void {
    // Reglas de negocio para cambios de estado
    if (currentStatus === EntityStatus.DELETED) {
      throw new InvalidStatusChangeError(currentStatus, newStatus);
    }

    if (currentStatus === newStatus) {
      throw new InvalidStatusChangeError(currentStatus, newStatus);
    }
  }
}
