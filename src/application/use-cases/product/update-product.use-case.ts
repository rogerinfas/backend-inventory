import { Injectable } from '@nestjs/common';
import type { ProductRepository } from '../../../domain/repositories/product.repository';
import { UpdateProductDto, ProductResponseDto } from '../../dto/product';
import { ProductMapper } from '../../mappers/product.mapper';
import { ProductNotFoundError, ProductInactiveError } from '../../errors/domain-errors';

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    // 1. Buscar producto existente
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new ProductNotFoundError(id);
    }

    // 2. Verificar que esté activo (si se está desactivando, permitir)
    if (!existingProduct.isActive && dto.isActive !== false) {
      throw new ProductInactiveError(id);
    }

    // 3. Aplicar actualizaciones
    const updatedProduct = ProductMapper.toUpdateDomain(dto, existingProduct);

    // 4. Guardar y retornar
    const savedProduct = await this.productRepository.update(updatedProduct);
    return ProductMapper.toResponseDto(savedProduct);
  }
}
