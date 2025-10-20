import { Injectable } from '@nestjs/common';
import type { ProductRepository } from '../../../domain/repositories/product.repository';
import { ProductResponseDto } from '../../dto/product';
import { ProductMapper } from '../../mappers/product.mapper';
import { ProductNotFoundError, ProductInactiveError } from '../../errors/domain-errors';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    // 1. Buscar producto existente
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new ProductNotFoundError(id);
    }

    // 2. Verificar que esté activo
    if (!existingProduct.isActive) {
      throw new ProductInactiveError(id);
    }

    // 3. Desactivar producto (soft delete)
    existingProduct.deactivate();
    await this.productRepository.update(existingProduct);
  }
}
