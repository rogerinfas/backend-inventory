import { Injectable, Inject } from '@nestjs/common';
import type { ProductRepository } from '../../../domain/repositories/product.repository';
import { AddStockDto, ProductResponseDto } from '../../dto/product';
import { ProductMapper } from '../../mappers/product.mapper';
import { ProductNotFoundError, ProductInactiveError } from '../../errors/domain-errors';

@Injectable()
export class AddStockUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository
  ) {}

  async execute(id: string, dto: AddStockDto): Promise<ProductResponseDto> {
    // 1. Buscar producto existente
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new ProductNotFoundError(id);
    }

    // 2. Verificar que esté activo
    if (!existingProduct.isActive) {
      throw new ProductInactiveError(id);
    }

    // 3. Agregar stock
    existingProduct.addStock(dto.quantity);

    // TODO: Implementar registro de movimiento de inventario con reason
    // - Crear registro en InventoryMovement con tipo ENTRY
    // - Almacenar dto.reason en el campo reason
    // - Registrar usuario que realiza la operación
    // - Guardar fecha y hora del movimiento

    // 4. Guardar y retornar
    const savedProduct = await this.productRepository.update(existingProduct);
    return ProductMapper.toResponseDto(savedProduct);
  }
}
