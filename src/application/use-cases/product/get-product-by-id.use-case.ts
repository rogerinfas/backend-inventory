import { Injectable } from '@nestjs/common';
import type { ProductRepository } from '../../../domain/repositories/product.repository';
import { ProductResponseDto } from '../../dto/product';
import { ProductMapper } from '../../mappers/product.mapper';
import { ResourceAccessDeniedError } from '../../errors/domain-errors';
import type { StoreFilter } from '../../../domain/value-objects';

@Injectable()
export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    id: string,
    storeFilter?: StoreFilter
  ): Promise<ProductResponseDto | null> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      return null;
    }

    // Validar que el producto pertenezca a la tienda del usuario
    // Solo aplica para ADMIN/SELLER, SUPERADMIN puede ver cualquier producto
    if (storeFilter && storeFilter.storeId && product.storeId !== storeFilter.storeId) {
      throw new ResourceAccessDeniedError('producto');
    }

    return ProductMapper.toResponseDto(product);
  }
}
