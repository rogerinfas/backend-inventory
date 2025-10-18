import { SupplierRepository } from '../../../domain/repositories/supplier.repository';
import { CreateSupplierDto, SupplierResponseDto } from '../../dto/supplier';
import { SupplierMapper } from '../../mappers/supplier.mapper';
import { SupplierAlreadyExistsError } from '../../errors/domain-errors';

export class CreateSupplierUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(dto: CreateSupplierDto): Promise<SupplierResponseDto> {
    // 1. Verificar que no exista ya un proveedor para esta tienda y persona
    const existingSupplier = await this.supplierRepository.findByStoreAndPerson(
      dto.storeId,
      dto.personId,
    );
    
    if (existingSupplier) {
      throw new SupplierAlreadyExistsError(dto.storeId, dto.personId);
    }

    // 2. Crear entidad
    const id = crypto.randomUUID();
    const supplier = SupplierMapper.toDomain(dto, id);

    // 3. Guardar
    const savedSupplier = await this.supplierRepository.save(supplier);

    // 4. Retornar DTO
    return SupplierMapper.toResponseDto(savedSupplier);
  }
}
