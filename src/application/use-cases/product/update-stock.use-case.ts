import { Injectable } from '@nestjs/common';
import type { ProductRepository } from '../../../domain/repositories/product.repository';
import { UpdateStockDto, ProductResponseDto } from '../../dto/product';
import { ProductMapper } from '../../mappers/product.mapper';
import { ProductNotFoundError, ProductInactiveError } from '../../errors/domain-errors';

@Injectable()
export class UpdateStockUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string, dto: UpdateStockDto): Promise<ProductResponseDto> {
    // 1. Buscar producto existente
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new ProductNotFoundError(id);
    }

    // 2. Verificar que esté activo
    if (!existingProduct.isActive) {
      throw new ProductInactiveError(id);
    }

    // 3. Actualizar stock
    const previousStock = existingProduct.currentStock;
    existingProduct.setStock(dto.quantity);

    // TODO: Implementar registro de movimiento de inventario con reason
    // - Crear registro en InventoryMovement con tipo ADJUSTMENT
    // - Almacenar dto.reason en el campo reason
    // - Registrar usuario que realiza la operación
    // - Guardar fecha y hora del movimiento
    // - Registrar stock anterior (previousStock) y nuevo stock (dto.quantity)
    // - Calcular diferencia de stock para auditoría

    // 4. Guardar y retornar
    const savedProduct = await this.productRepository.update(existingProduct);
    return ProductMapper.toResponseDto(savedProduct);
  }
}
