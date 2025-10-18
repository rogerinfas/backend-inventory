import { SupplierRepository } from '../../../domain/repositories/supplier.repository';
import { UpdateSupplierDto, SupplierResponseDto } from '../../dto/supplier';
import { SupplierMapper } from '../../mappers/supplier.mapper';
import { SupplierNotFoundError, SupplierDeletedError, InvalidStatusChangeError } from '../../errors/domain-errors';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class UpdateSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(id: string, dto: UpdateSupplierDto): Promise<SupplierResponseDto> {
    // 1. Buscar proveedor existente
    const existingSupplier = await this.supplierRepository.findById(id);
    if (!existingSupplier) {
      throw new SupplierNotFoundError(id);
    }

    // 2. Verificar que no esté eliminado
    if (existingSupplier.isDeleted()) {
      throw new SupplierDeletedError(id);
    }

    // 3. Validar que hay campos para actualizar
    if (!this.validateUpdateDto(dto)) {
      throw new Error('No hay campos válidos para actualizar');
    }

    // 4. Aplicar actualizaciones
    if (dto.status !== undefined) {
      this.validateStatusChange(existingSupplier.status, dto.status);
      this.applyStatusChange(existingSupplier, dto.status);
    }

    // 5. Guardar y retornar
    const savedSupplier = await this.supplierRepository.update(existingSupplier);
    return SupplierMapper.toResponseDto(savedSupplier);
  }

  private validateUpdateDto(dto: UpdateSupplierDto): boolean {
    return dto.status !== undefined;
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

  private applyStatusChange(supplier: any, newStatus: EntityStatus): void {
    switch (newStatus) {
      case EntityStatus.ACTIVE:
        supplier.activate();
        break;
      case EntityStatus.INACTIVE:
        supplier.deactivate();
        break;
      case EntityStatus.SUSPENDED:
        supplier.suspend();
        break;
      case EntityStatus.DELETED:
        supplier.delete();
        break;
    }
  }
}
