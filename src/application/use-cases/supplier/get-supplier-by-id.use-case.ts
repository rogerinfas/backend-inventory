import { ForbiddenException } from '@nestjs/common';
import { SupplierRepository } from '../../../domain/repositories/supplier.repository';
import { SupplierResponseDto } from '../../dto/supplier';
import { SupplierMapper } from '../../mappers/supplier.mapper';
import { SupplierNotFoundError } from '../../errors/domain-errors';
import type { StoreFilter } from '../../../domain/value-objects';

export class GetSupplierByIdUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(
    id: string,
    storeFilter?: StoreFilter
  ): Promise<SupplierResponseDto> {
    // 1. Buscar proveedor
    const supplier = await this.supplierRepository.findById(id);
    
    if (!supplier) {
      throw new SupplierNotFoundError(id);
    }

    // Validar que el proveedor pertenezca a la tienda del solicitante
    // Solo aplica para ADMIN/SELLER, SUPERADMIN puede ver cualquier proveedor
    if (storeFilter && storeFilter.storeId && supplier.storeId !== storeFilter.storeId) {
      throw new ForbiddenException(
        'No tiene permisos para acceder a este proveedor'
      );
    }

    // 2. Retornar DTO
    return SupplierMapper.toResponseDto(supplier);
  }
}
