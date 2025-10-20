import { Injectable } from '@nestjs/common';
import type { ProductRepository } from '../../../domain/repositories/product.repository';
import { RemoveStockDto, ProductResponseDto } from '../../dto/product';
import { ProductMapper } from '../../mappers/product.mapper';
import { ProductNotFoundError, ProductInactiveError, InsufficientStockError } from '../../errors/domain-errors';

@Injectable()
export class RemoveStockUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string, dto: RemoveStockDto): Promise<ProductResponseDto> {
    // 1. Buscar producto existente
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new ProductNotFoundError(id);
    }

    // 2. Verificar que esté activo
    if (!existingProduct.isActive) {
      throw new ProductInactiveError(id);
    }

    // 3. Verificar stock suficiente
    if (!existingProduct.hasStockAvailable(dto.quantity)) {
      throw new InsufficientStockError(dto.quantity, existingProduct.currentStock);
    }

    // 4. Remover stock
    existingProduct.removeStock(dto.quantity);

    // TODO: Implementar registro de movimiento de inventario con reason
    // - Crear registro en InventoryMovement con tipo EXIT
    // - Almacenar dto.reason en el campo reason
    // - Registrar usuario que realiza la operación
    // - Guardar fecha y hora del movimiento
    // - Registrar stock anterior y nuevo stock

    // 5. Guardar y retornar
    const savedProduct = await this.productRepository.update(existingProduct);
    return ProductMapper.toResponseDto(savedProduct);
  }
}
