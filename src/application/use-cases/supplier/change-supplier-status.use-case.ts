import { SupplierRepository } from '../../../domain/repositories/supplier.repository';
import { ChangeSupplierStatusDto, SupplierResponseDto } from '../../dto/supplier';
import { SupplierMapper } from '../../mappers/supplier.mapper';
import { SupplierNotFoundError, SupplierDeletedError, InvalidStatusChangeError } from '../../errors/domain-errors';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class ChangeSupplierStatusUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(id: string, dto: ChangeSupplierStatusDto): Promise<SupplierResponseDto> {
    // 1. Buscar proveedor existente
    const existingSupplier = await this.supplierRepository.findById(id);
    if (!existingSupplier) {
      throw new SupplierNotFoundError(id);
    }

    // 2. Verificar que no esté eliminado
    if (existingSupplier.isDeleted()) {
      throw new SupplierDeletedError(id);
    }

    // 3. Validar cambio de estado
    this.validateStatusChange(existingSupplier.status, dto.status);

    // 4. Aplicar cambio de estado
    switch (dto.status) {
      case EntityStatus.ACTIVE:
        existingSupplier.activate();
        break;
      case EntityStatus.INACTIVE:
        existingSupplier.deactivate();
        break;
      case EntityStatus.SUSPENDED:
        existingSupplier.suspend();
        break;
      case EntityStatus.DELETED:
        existingSupplier.delete();
        break;
    }

    // 5. Guardar y retornar
    const savedSupplier = await this.supplierRepository.update(existingSupplier);
    return SupplierMapper.toResponseDto(savedSupplier);
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
