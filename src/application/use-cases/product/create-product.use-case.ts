import { Injectable, Inject } from '@nestjs/common';
import type { ProductRepository } from '../../../domain/repositories/product.repository';
import { CreateProductDto, ProductResponseDto } from '../../dto/product';
import { ProductMapper } from '../../mappers/product.mapper';
import { ProductAlreadyExistsError } from '../../errors/domain-errors';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductResponseDto> {
    // 1. Verificar unicidad de SKU
    const existingProduct = await this.productRepository.findBySku(dto.sku);
    if (existingProduct) {
      throw new ProductAlreadyExistsError('SKU', dto.sku);
    }

    // 2. Crear entidad
    const id = crypto.randomUUID();
    const product = ProductMapper.toDomain(dto, id);

    // 3. Guardar
    const savedProduct = await this.productRepository.save(product);

    // 4. Retornar DTO
    return ProductMapper.toResponseDto(savedProduct);
  }
}
