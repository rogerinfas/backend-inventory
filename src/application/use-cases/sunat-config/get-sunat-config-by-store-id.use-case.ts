import { Injectable } from '@nestjs/common';
import type { SunatConfigRepository } from '../../../domain/repositories';
import { SunatConfigResponseDto } from '../../dto/sunat-config';
import { SunatConfigMapper } from '../../mappers/sunat-config.mapper';

@Injectable()
export class GetSunatConfigByStoreIdUseCase {
  constructor(private readonly sunatConfigRepository: SunatConfigRepository) {}

  async execute(storeId: string): Promise<SunatConfigResponseDto | null> {
    const sunatConfig = await this.sunatConfigRepository.findByStoreId(storeId);
    
    if (!sunatConfig) {
      return null;
    }

    return SunatConfigMapper.toResponseDto(sunatConfig);
  }
}
