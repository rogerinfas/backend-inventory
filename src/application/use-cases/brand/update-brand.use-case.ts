import { UpdateBrandDto, BrandResponseDto } from '../../dto/brand';
import { BrandRepository } from '../../../domain/repositories';
import { BrandMapper } from '../../mappers';
import { BrandNotFoundError, BrandDeletedError, BrandAlreadyExistsError } from '../../errors';

export class UpdateBrandUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(id: string, dto: UpdateBrandDto): Promise<BrandResponseDto> {
    // Buscar marca existente
    const existingBrand = await this.brandRepository.findById(id);
    if (!existingBrand) {
      throw new BrandNotFoundError(id);
    }

    // Verificar que no esté eliminada
    if (existingBrand.isDeleted()) {
      throw new BrandDeletedError(id);
    }

    // Verificar nombre único si se actualiza
    if (dto.name && dto.name !== existingBrand.name) {
      const existingName = await this.brandRepository.findByName(dto.name);
      if (existingName && existingName.id !== id) {
        throw new BrandAlreadyExistsError('nombre', dto.name);
      }
    }

    // Aplicar actualizaciones
    const updatedBrand = BrandMapper.toUpdateDomain(dto, existingBrand);

    // Guardar y retornar
    const savedBrand = await this.brandRepository.update(updatedBrand);
    return BrandMapper.toResponseDto(savedBrand);
  }
}
