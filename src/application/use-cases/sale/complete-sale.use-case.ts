import { Injectable } from '@nestjs/common';
import type { SaleRepository } from '../../../domain/repositories';
import { SaleResponseDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';
import { SaleNotFoundError, SaleAlreadyCompletedError } from '../../errors/domain-errors';

@Injectable()
export class CompleteSaleUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(id: string): Promise<SaleResponseDto> {
    // 1. Buscar venta existente
    const existingSale = await this.saleRepository.findById(id);
    if (!existingSale) {
      throw new SaleNotFoundError(id);
    }

    // 2. Verificar que se puede completar
    if (existingSale.status === 'COMPLETED') {
      throw new SaleAlreadyCompletedError(id);
    }

    // 3. Completar la venta
    existingSale.complete();

    // 4. Guardar y retornar
    const savedSale = await this.saleRepository.update(existingSale);
    return SaleMapper.toResponseDto(savedSale);
  }
}
