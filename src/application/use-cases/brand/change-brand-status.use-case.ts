import { ChangeBrandStatusDto, BrandResponseDto } from '../../dto/brand';
import { BrandRepository } from '../../../domain/repositories';
import { BrandMapper } from '../../mappers';
import { BrandNotFoundError, BrandDeletedError } from '../../errors';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class ChangeBrandStatusUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(id: string, dto: ChangeBrandStatusDto): Promise<BrandResponseDto> {
    // Buscar marca existente
    const existingBrand = await this.brandRepository.findById(id);
    if (!existingBrand) {
      throw new BrandNotFoundError(id);
    }

    // Verificar que no esté eliminada (excepto si queremos eliminarla)
    if (existingBrand.isDeleted() && dto.status !== EntityStatus.DELETED) {
      throw new BrandDeletedError(id);
    }

    // Aplicar cambio de estado
    switch (dto.status) {
      case EntityStatus.ACTIVE:
        existingBrand.activate();
        break;
      case EntityStatus.INACTIVE:
        existingBrand.deactivate();
        break;
      case EntityStatus.SUSPENDED:
        existingBrand.suspend();
        break;
      case EntityStatus.DELETED:
        existingBrand.delete();
        break;
    }

    // Guardar y retornar
    const savedBrand = await this.brandRepository.update(existingBrand);
    return BrandMapper.toResponseDto(savedBrand);
  }
}
