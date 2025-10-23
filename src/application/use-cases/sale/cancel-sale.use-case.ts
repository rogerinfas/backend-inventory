import { Injectable } from '@nestjs/common';
import type { SaleRepository } from '../../../domain/repositories';
import { SaleResponseDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';
import { SaleNotFoundError, SaleCancelledError, SaleCompletedError } from '../../errors/domain-errors';

@Injectable()
export class CancelSaleUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(id: string): Promise<SaleResponseDto> {
    // 1. Buscar venta existente
    const existingSale = await this.saleRepository.findById(id);
    if (!existingSale) {
      throw new SaleNotFoundError(id);
    }

    // 2. Verificar que se puede cancelar
    if (existingSale.status === 'CANCELLED') {
      throw new SaleCancelledError(id);
    }

    if (existingSale.status === 'COMPLETED') {
      throw new SaleCompletedError(id);
    }

    // 3. Cancelar la venta
    existingSale.cancel();

    // 4. Guardar y retornar
    const savedSale = await this.saleRepository.update(existingSale);
    return SaleMapper.toResponseDto(savedSale);
  }
}
