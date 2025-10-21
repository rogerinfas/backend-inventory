import { Injectable } from '@nestjs/common';
import type { SaleRepository } from '../../../domain/repositories';
import { SaleQueryDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';

export interface ListSalesResult {
  sales: any[];
  total: number;
  offset: number;
  limit: number;
}

@Injectable()
export class ListSalesUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(query: SaleQueryDto): Promise<ListSalesResult> {
    const filters = {
      storeId: query.storeId,
      customerId: query.customerId,
      userId: query.userId,
      status: query.status,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      search: query.search,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };

    const [sales, total] = await Promise.all([
      this.saleRepository.findMany(filters),
      this.saleRepository.count(filters),
    ]);

    return {
      sales: sales.map(sale => SaleMapper.toResponseDto(sale, [])), // TODO: Obtener detalles
      total,
      offset: query.offset || 0,
      limit: query.limit || 10,
    };
  }
}
