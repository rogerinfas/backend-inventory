import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, MinLength, MaxLength, Min, Max, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UnitOfMeasure } from '../../../domain/enums/unit-of-measure.enum';

export class CreateProductDto {
  @ApiProperty({
    description: 'ID de la tienda a la que pertenece el producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  storeId: string;

  @ApiProperty({
    description: 'Código SKU único del producto (Stock Keeping Unit)',
    example: 'LAPTOP-DELL-001',
    minLength: 3,
    maxLength: 50
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  sku: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Dell Inspiron 15 3000',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del producto',
    example: 'Laptop Dell Inspiron 15 3000 con procesador Intel Core i5, 8GB RAM, 256GB SSD',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Precio de compra del producto',
    example: 1200.50,
    minimum: 0,
    maximum: 999999.99
  })
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  purchasePrice: number;

  @ApiProperty({
    description: 'Precio de venta del producto',
    example: 1500.00,
    minimum: 0,
    maximum: 999999.99
  })
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  salePrice: number;

  @ApiPropertyOptional({
    description: 'Stock mínimo del producto (por defecto 5)',
    example: 10,
    minimum: 0,
    maximum: 999999,
    default: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999)
  minimumStock?: number;

  @ApiPropertyOptional({
    description: 'Stock máximo del producto (opcional)',
    example: 100,
    minimum: 0,
    maximum: 999999
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999)
  maximumStock?: number;

  @ApiPropertyOptional({
    description: 'Unidad de medida del producto',
    enum: UnitOfMeasure,
    example: UnitOfMeasure.UNIT,
    default: UnitOfMeasure.UNIT
  })
  @IsOptional()
  @IsEnum(UnitOfMeasure)
  unitOfMeasure?: UnitOfMeasure;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/images/laptop-dell-001.jpg',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría del producto',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid'
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'ID de la marca del producto',
    example: '123e4567-e89b-12d3-a456-426614174002',
    format: 'uuid'
  })
  @IsOptional()
  @IsUUID()
  brandId?: string;
}
