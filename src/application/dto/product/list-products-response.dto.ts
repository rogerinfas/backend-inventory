import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';

export class ListProductsResponseDto {
  @ApiProperty({
    description: 'Lista de productos',
    type: [ProductResponseDto],
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        storeId: '123e4567-e89b-12d3-a456-426614174000',
        sku: 'LAPTOP-DELL-001',
        name: 'Laptop Dell Inspiron 15 3000',
        description: 'Laptop Dell Inspiron 15 3000 con procesador Intel Core i5, 8GB RAM, 256GB SSD',
        purchasePrice: 1200.50,
        salePrice: 1500.00,
        currentStock: 25,
        minimumStock: 10,
        maximumStock: 100,
        unitOfMeasure: 'UNIT',
        imageUrl: 'https://example.com/images/laptop-dell-001.jpg',
        isActive: true,
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T15:45:00.000Z',
        categoryId: '123e4567-e89b-12d3-a456-426614174001',
        brandId: '123e4567-e89b-12d3-a456-426614174002'
      }
    ]
  })
  data: ProductResponseDto[];

  @ApiProperty({
    description: 'Total de productos que coinciden con los filtros',
    example: 150,
    type: 'integer'
  })
  total: number;

  @ApiProperty({
    description: 'Número de página actual',
    example: 1,
    type: 'integer'
  })
  page: number;

  @ApiProperty({
    description: 'Límite de resultados por página',
    example: 10,
    type: 'integer'
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas disponibles',
    example: 15,
    type: 'integer'
  })
  totalPages: number;
}
