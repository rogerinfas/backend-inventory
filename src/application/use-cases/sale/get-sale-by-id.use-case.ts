import { Injectable } from '@nestjs/common';
import type { SaleRepository } from '../../../domain/repositories';
import { SaleResponseDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';
import { SaleNotFoundError } from '../../errors/domain-errors';

@Injectable()
export class GetSaleByIdUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(saleId: string): Promise<SaleResponseDto> {
    try {
      // 1. Buscar la venta
      const sale = await this.saleRepository.findById(saleId);
      if (!sale) {
        throw new SaleNotFoundError(saleId);
      }

      // 2. Obtener los detalles
      const details = await this.getSaleDetails(saleId);

      return SaleMapper.toResponseDto(sale, details);
    } catch (error) {
      if (error instanceof SaleNotFoundError) {
        throw error;
      }
      throw new Error(`Error al obtener la venta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private async getSaleDetails(saleId: string): Promise<any[]> {
    // TODO: Implementar método en SaleRepository para obtener detalles
    return [];
  }
}
