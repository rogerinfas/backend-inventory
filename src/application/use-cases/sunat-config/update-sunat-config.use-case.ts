import { Injectable } from '@nestjs/common';
import type { SunatConfigRepository } from '../../../domain/repositories';
import { UpdateSunatConfigDto, SunatConfigResponseDto } from '../../dto/sunat-config';
import { SunatConfigMapper } from '../../mappers/sunat-config.mapper';
import { SunatConfigNotFoundError } from '../../errors/domain-errors';

@Injectable()
export class UpdateSunatConfigUseCase {
  constructor(private readonly sunatConfigRepository: SunatConfigRepository) {}

  async execute(id: string, dto: UpdateSunatConfigDto): Promise<SunatConfigResponseDto> {
    // 1. Buscar configuración existente
    const existingConfig = await this.sunatConfigRepository.findById(id);
    if (!existingConfig) {
      throw new SunatConfigNotFoundError(id);
    }

    // 2. Aplicar actualizaciones
    const updatedConfig = SunatConfigMapper.toUpdateDomain(dto, existingConfig);

    // 3. Guardar y retornar
    const savedConfig = await this.sunatConfigRepository.update(updatedConfig);
    return SunatConfigMapper.toResponseDto(savedConfig);
  }
}
