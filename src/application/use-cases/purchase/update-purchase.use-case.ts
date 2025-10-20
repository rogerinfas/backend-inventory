import { Injectable } from '@nestjs/common';
import type { PurchaseRepository } from '../../../domain/repositories';
import { UpdatePurchaseDto, PurchaseResponseDto } from '../../dto/purchase';
import { PurchaseMapper } from '../../mappers';
import { PurchaseNotFoundError, PurchaseCancelledError, PurchaseReceivedError } from '../../errors/domain-errors';

@Injectable()
export class UpdatePurchaseUseCase {
  constructor(private readonly purchaseRepository: PurchaseRepository) {}

  async execute(id: string, dto: UpdatePurchaseDto): Promise<PurchaseResponseDto> {
    // 1. Buscar compra existente
    const existingPurchase = await this.purchaseRepository.findById(id);
    if (!existingPurchase) {
      throw new PurchaseNotFoundError(id);
    }

    // 2. Verificar que se puede actualizar
    if (existingPurchase.status === 'CANCELLED') {
      throw new PurchaseCancelledError(id);
    }

    if (existingPurchase.status === 'RECEIVED') {
      throw new PurchaseReceivedError(id);
    }

    // 3. Actualizar la compra usando el mapper
    const updatedPurchase = PurchaseMapper.toDomainFromUpdate(dto, existingPurchase);

    // 4. Guardar y retornar
    const savedPurchase = await this.purchaseRepository.update(updatedPurchase);
    return PurchaseMapper.toResponseDto(savedPurchase);
  }
}
