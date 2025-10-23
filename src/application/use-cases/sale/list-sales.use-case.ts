import { Injectable } from '@nestjs/common';
import type { SaleRepository, SaleQueryFilters } from '../../../domain/repositories';
import { SaleQueryDto, ListSalesResponseDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';

export interface ListSalesResult {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class ListSalesUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(query: SaleQueryDto): Promise<ListSalesResult> {
    // 1. Construir filtros
    const filters: SaleQueryFilters = SaleMapper.toQueryFilters(query);

    // 2. Obtener ventas con paginación
    const sales = await this.saleRepository.findByFilters(filters);
    const total = await this.saleRepository.countByFilters(filters);

    // 3. Mapear a DTOs de respuesta
    const data = SaleMapper.toResponseDtoList(sales);

    // 4. Calcular metadatos de paginación
    const totalPages = Math.ceil(total / (query.limit || 10));

    return {
      data,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 10,
        total,
        totalPages,
      },
    };
  }
}
