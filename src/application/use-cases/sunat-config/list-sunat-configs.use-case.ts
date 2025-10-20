import { Injectable } from '@nestjs/common';
import type { SunatConfigRepository } from '../../../domain/repositories';
import { SunatConfigQueryDto, SunatConfigResponseDto } from '../../dto/sunat-config';
import { SunatConfigMapper } from '../../mappers/sunat-config.mapper';

export interface ListSunatConfigsResult {
  data: SunatConfigResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ListSunatConfigsUseCase {
  constructor(private readonly sunatConfigRepository: SunatConfigRepository) {}

  async execute(query: SunatConfigQueryDto): Promise<ListSunatConfigsResult> {
    const filters = SunatConfigMapper.toQueryFilters(query);
    
    // Obtener datos paginados
    const sunatConfigs = await this.sunatConfigRepository.findMany(filters);
    const total = await this.sunatConfigRepository.count(filters);

    // Convertir a DTOs
    const data = sunatConfigs.map(config => SunatConfigMapper.toResponseDto(config));

    // Calcular metadatos de paginación
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
}
