import { Injectable } from '@nestjs/common';
import type { PurchaseRepository } from '../../../domain/repositories';
import { PurchaseResponseDto } from '../../dto/purchase';
import { PurchaseMapper } from '../../mappers';
import { PurchaseNotFoundError, PurchaseCancelledError, PurchaseReceivedError } from '../../errors/domain-errors';

@Injectable()
export class CancelPurchaseUseCase {
  constructor(private readonly purchaseRepository: PurchaseRepository) {}

  async execute(id: string): Promise<PurchaseResponseDto> {
    // 1. Buscar compra existente
    const existingPurchase = await this.purchaseRepository.findById(id);
    if (!existingPurchase) {
      throw new PurchaseNotFoundError(id);
    }

    // 2. Verificar que se puede cancelar
    if (existingPurchase.status === 'CANCELLED') {
      throw new PurchaseCancelledError(id);
    }

    if (existingPurchase.status === 'RECEIVED') {
      throw new PurchaseReceivedError(id);
    }

    // 3. Cancelar la compra
    existingPurchase.cancel();

    // 4. Guardar y retornar
    const savedPurchase = await this.purchaseRepository.update(existingPurchase);
    return PurchaseMapper.toResponseDto(savedPurchase);
  }
}
