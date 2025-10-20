import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitOfMeasure } from '../../../domain/enums/unit-of-measure.enum';

export class ProductResponseDto {
  @ApiProperty({
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  id: string;

  @ApiProperty({
    description: 'ID de la tienda a la que pertenece el producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  storeId: string;

  @ApiProperty({
    description: 'Código SKU único del producto',
    example: 'LAPTOP-DELL-001'
  })
  sku: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Dell Inspiron 15 3000'
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del producto',
    example: 'Laptop Dell Inspiron 15 3000 con procesador Intel Core i5, 8GB RAM, 256GB SSD',
    nullable: true
  })
  description: string | null;

  @ApiProperty({
    description: 'Precio de compra del producto',
    example: 1200.50,
    type: 'number',
    format: 'float'
  })
  purchasePrice: number;

  @ApiProperty({
    description: 'Precio de venta del producto',
    example: 1500.00,
    type: 'number',
    format: 'float'
  })
  salePrice: number;

  @ApiProperty({
    description: 'Stock actual del producto',
    example: 25,
    type: 'integer'
  })
  currentStock: number;

  @ApiProperty({
    description: 'Stock mínimo del producto',
    example: 10,
    type: 'integer'
  })
  minimumStock: number;

  @ApiPropertyOptional({
    description: 'Stock máximo del producto',
    example: 100,
    type: 'integer',
    nullable: true
  })
  maximumStock: number | null;

  @ApiProperty({
    description: 'Unidad de medida del producto',
    enum: UnitOfMeasure,
    example: UnitOfMeasure.UNIT
  })
  unitOfMeasure: UnitOfMeasure;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/images/laptop-dell-001.jpg',
    nullable: true
  })
  imageUrl: string | null;

  @ApiProperty({
    description: 'Estado activo del producto',
    example: true,
    type: 'boolean'
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación del producto',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del producto',
    example: '2024-01-15T15:45:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'ID de la categoría del producto',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
    nullable: true
  })
  categoryId: string | null;

  @ApiPropertyOptional({
    description: 'ID de la marca del producto',
    example: '123e4567-e89b-12d3-a456-426614174002',
    format: 'uuid',
    nullable: true
  })
  brandId: string | null;
}
