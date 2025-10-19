import { BrandResponseDto } from '../../dto/brand';
import { BrandRepository } from '../../../domain/repositories';
import { BrandMapper } from '../../mappers';

export class GetBrandByIdUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(id: string): Promise<BrandResponseDto | null> {
    const brand = await this.brandRepository.findById(id);
    
    if (!brand) {
      return null;
    }

    return BrandMapper.toResponseDto(brand);
  }
}
