import { Injectable } from '@nestjs/common';
import type { SaleRepository } from '../../../domain/repositories';
import { SaleResponseDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';
import { SaleNotFoundError } from '../../errors/domain-errors';

@Injectable()
export class GetSaleByIdUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(id: string): Promise<SaleResponseDto> {
    // 1. Buscar venta por ID
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new SaleNotFoundError(id);
    }

    // 2. Retornar DTO de respuesta
    return SaleMapper.toResponseDto(sale);
  }
}
