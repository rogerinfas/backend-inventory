import { SupplierRepository } from '../../../domain/repositories/supplier.repository';
import { SupplierResponseDto } from '../../dto/supplier';
import { SupplierMapper } from '../../mappers/supplier.mapper';
import { SupplierNotFoundError } from '../../errors/domain-errors';

export class GetSupplierByIdUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(id: string): Promise<SupplierResponseDto> {
    // 1. Buscar proveedor
    const supplier = await this.supplierRepository.findById(id);
    
    if (!supplier) {
      throw new SupplierNotFoundError(id);
    }

    // 2. Retornar DTO
    return SupplierMapper.toResponseDto(supplier);
  }
}
