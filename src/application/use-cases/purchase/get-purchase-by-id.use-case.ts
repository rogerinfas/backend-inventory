import { Injectable } from '@nestjs/common';
import type { PurchaseRepository } from '../../../domain/repositories';
import { PurchaseResponseDto } from '../../dto/purchase';
import { PurchaseMapper } from '../../mappers';
import { PurchaseNotFoundError } from '../../errors/domain-errors';

@Injectable()
export class GetPurchaseByIdUseCase {
  constructor(private readonly purchaseRepository: PurchaseRepository) {}

  async execute(id: string): Promise<PurchaseResponseDto> {
    // 1. Buscar compra con detalles
    const purchaseWithDetails = await this.purchaseRepository.findWithDetails(id);
    if (!purchaseWithDetails) {
      throw new PurchaseNotFoundError(id);
    }

    // 2. Retornar respuesta usando el mapper
    return PurchaseMapper.toResponseDto(purchaseWithDetails.purchase, purchaseWithDetails.details);
  }
}
