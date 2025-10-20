import { Injectable } from '@nestjs/common';
import type { SunatConfigRepository } from '../../../domain/repositories';
import { SunatConfigResponseDto } from '../../dto/sunat-config';
import { SunatConfigMapper } from '../../mappers/sunat-config.mapper';
import { SunatConfigNotFoundError } from '../../errors/domain-errors';

@Injectable()
export class DeleteSunatConfigUseCase {
  constructor(private readonly sunatConfigRepository: SunatConfigRepository) {}

  async execute(id: string): Promise<void> {
    // 1. Verificar que existe
    const exists = await this.sunatConfigRepository.exists(id);
    if (!exists) {
      throw new SunatConfigNotFoundError(id);
    }

    // 2. Eliminar
    await this.sunatConfigRepository.delete(id);
  }
}
