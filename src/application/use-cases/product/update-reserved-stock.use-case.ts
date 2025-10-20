import { Injectable } from '@nestjs/common';
import type { ProductRepository } from '../../../domain/repositories/product.repository';

@Injectable()
export class UpdateReservedStockUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(productId: string, storeId: string, reservedStock: number) {
    // Delegar validación y persistencia al repositorio
    const updated = await this.productRepository.setReservedStock(productId, reservedStock, storeId);
    return {
      id: updated.id,
      storeId: updated.storeId,
      sku: updated.sku,
      name: updated.name,
      currentStock: updated.currentStock,
      reservedStock: updated.reservedStock,
      updatedAt: updated.updatedAt,
    };
  }
}
