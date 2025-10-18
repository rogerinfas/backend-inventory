import { SupplierRepository } from '../../../domain/repositories/supplier.repository';
import { SupplierNotFoundError, SupplierDeletedError } from '../../errors/domain-errors';

export class DeleteSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(id: string): Promise<void> {
    // 1. Buscar proveedor existente
    const existingSupplier = await this.supplierRepository.findById(id);
    if (!existingSupplier) {
      throw new SupplierNotFoundError(id);
    }

    // 2. Verificar que no esté ya eliminado
    if (existingSupplier.isDeleted()) {
      throw new SupplierDeletedError(id);
    }

    // 3. Realizar soft delete
    existingSupplier.delete();

    // 4. Guardar cambios
    await this.supplierRepository.update(existingSupplier);
  }
}
