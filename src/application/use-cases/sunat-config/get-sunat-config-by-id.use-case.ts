import { Injectable } from '@nestjs/common';
import type { SunatConfigRepository } from '../../../domain/repositories';
import { SunatConfigResponseDto } from '../../dto/sunat-config';
import { SunatConfigMapper } from '../../mappers/sunat-config.mapper';

@Injectable()
export class GetSunatConfigByIdUseCase {
  constructor(private readonly sunatConfigRepository: SunatConfigRepository) {}

  async execute(id: string): Promise<SunatConfigResponseDto | null> {
    const sunatConfig = await this.sunatConfigRepository.findById(id);
    
    if (!sunatConfig) {
      return null;
    }

    return SunatConfigMapper.toResponseDto(sunatConfig);
  }
}
