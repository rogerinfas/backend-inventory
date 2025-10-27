import { Injectable } from '@nestjs/common';
import type { PurchaseRepository } from '../../../domain/repositories';
import { PurchaseResponseDto } from '../../dto/purchase';
import { PurchaseMapper } from '../../mappers';
import { PurchaseNotFoundError, ResourceAccessDeniedError } from '../../errors/domain-errors';
import type { StoreFilter } from '../../../domain/value-objects';

@Injectable()
export class GetPurchaseByIdUseCase {
  constructor(private readonly purchaseRepository: PurchaseRepository) {}

  async execute(
    id: string,
    storeFilter?: StoreFilter
  ): Promise<PurchaseResponseDto> {
    // 1. Buscar compra con detalles
    const purchaseWithDetails = await this.purchaseRepository.findWithDetails(id);
    if (!purchaseWithDetails) {
      throw new PurchaseNotFoundError(id);
    }

    // Validar que la compra pertenezca a la tienda del usuario
    // Solo aplica para ADMIN/SELLER, SUPERADMIN puede ver cualquier compra
    if (storeFilter && storeFilter.storeId && purchaseWithDetails.purchase.storeId !== storeFilter.storeId) {
      throw new ResourceAccessDeniedError('compra');
    }

    // 2. Retornar respuesta usando el mapper
    return PurchaseMapper.toResponseDto(purchaseWithDetails.purchase, purchaseWithDetails.details);
  }
}
