import { Injectable } from '@nestjs/common';
import type { ProductRepository } from '../../../domain/repositories/product.repository';
import { ProductQueryDto, ProductResponseDto } from '../../dto/product';
import { ProductMapper } from '../../mappers/product.mapper';

export interface ListProductsResult {
  data: ProductResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(query: ProductQueryDto): Promise<ListProductsResult> {
    const filters = ProductMapper.toQueryFilters(query);
    
    // Obtener datos paginados
    const products = await this.productRepository.findMany(filters);
    const total = await this.productRepository.count(filters);

    // Convertir a DTOs
    const data = products.map(product => ProductMapper.toResponseDto(product));

    // Calcular metadatos de paginación
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
}
