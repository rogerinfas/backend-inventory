import { Injectable } from '@nestjs/common';
import type { SaleRepository } from '../../../domain/repositories';
import { SaleResponseDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';
import { SaleNotFoundError, ResourceAccessDeniedError } from '../../errors/domain-errors';
import type { StoreFilter } from '../../../domain/value-objects';

@Injectable()
export class GetSaleByIdUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(
    id: string,
    storeFilter?: StoreFilter
  ): Promise<SaleResponseDto> {
    // 1. Buscar venta por ID
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new SaleNotFoundError(id);
    }

    // Validar que la venta pertenezca a la tienda del usuario
    // Solo aplica para ADMIN/SELLER, SUPERADMIN puede ver cualquier venta
    if (storeFilter && storeFilter.storeId && sale.storeId !== storeFilter.storeId) {
      throw new ResourceAccessDeniedError('venta');
    }

    // 2. Retornar DTO de respuesta
    return SaleMapper.toResponseDto(sale);
  }
}
