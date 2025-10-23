import { Injectable } from '@nestjs/common';
import type { SaleRepository } from '../../../domain/repositories';
import { UpdateSaleDto, SaleResponseDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';
import { SaleNotFoundError, SaleNotPendingError } from '../../errors/domain-errors';

@Injectable()
export class UpdateSaleUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(id: string, dto: UpdateSaleDto): Promise<SaleResponseDto> {
    // 1. Buscar venta existente
    const existingSale = await this.saleRepository.findById(id);
    if (!existingSale) {
      throw new SaleNotFoundError(id);
    }

    // 2. Verificar que se puede actualizar (solo ventas pendientes)
    if (existingSale.status !== 'PENDING') {
      throw new SaleNotPendingError(id);
    }

    // 3. Actualizar la venta
    const updatedSale = SaleMapper.toDomainFromUpdate(dto, existingSale);

    // 4. Guardar y retornar
    const savedSale = await this.saleRepository.update(updatedSale);
    return SaleMapper.toResponseDto(savedSale);
  }
}
