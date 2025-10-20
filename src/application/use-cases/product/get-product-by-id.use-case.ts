import { Injectable } from '@nestjs/common';
import type { ProductRepository } from '../../../domain/repositories/product.repository';
import { ProductResponseDto } from '../../dto/product';
import { ProductMapper } from '../../mappers/product.mapper';
import { ProductNotFoundError } from '../../errors/domain-errors';

@Injectable()
export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<ProductResponseDto | null> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      return null;
    }

    return ProductMapper.toResponseDto(product);
  }
}
