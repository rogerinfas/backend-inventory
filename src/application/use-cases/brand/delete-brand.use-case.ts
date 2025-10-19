import { BrandResponseDto } from '../../dto/brand';
import { BrandRepository } from '../../../domain/repositories';
import { BrandMapper } from '../../mappers';
import { BrandNotFoundError, BrandDeletedError } from '../../errors';

export class DeleteBrandUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(id: string): Promise<BrandResponseDto> {
    // Buscar marca existente
    const existingBrand = await this.brandRepository.findById(id);
    if (!existingBrand) {
      throw new BrandNotFoundError(id);
    }

    // Verificar que no esté ya eliminada
    if (existingBrand.isDeleted()) {
      throw new BrandDeletedError(id);
    }

    // Aplicar soft delete
    existingBrand.delete();

    // Guardar y retornar
    const savedBrand = await this.brandRepository.update(existingBrand);
    return BrandMapper.toResponseDto(savedBrand);
  }
}
