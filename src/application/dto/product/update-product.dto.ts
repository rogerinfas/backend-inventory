import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, MinLength, MaxLength, Min, Max, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UnitOfMeasure } from '../../../domain/enums/unit-of-measure.enum';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Nombre del producto',
    example: 'Laptop Dell Inspiron 15 3000 Actualizada',
    minLength: 2,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del producto',
    example: 'Laptop Dell Inspiron 15 3000 con procesador Intel Core i7, 16GB RAM, 512GB SSD',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Precio de compra del producto',
    example: 1300.75,
    minimum: 0,
    maximum: 999999.99
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  purchasePrice?: number;

  @ApiPropertyOptional({
    description: 'Precio de venta del producto',
    example: 1600.00,
    minimum: 0,
    maximum: 999999.99
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  salePrice?: number;

  @ApiPropertyOptional({
    description: 'Stock mínimo del producto',
    example: 15,
    minimum: 0,
    maximum: 999999
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999)
  minimumStock?: number;

  @ApiPropertyOptional({
    description: 'Stock máximo del producto',
    example: 150,
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
    example: UnitOfMeasure.UNIT
  })
  @IsOptional()
  @IsEnum(UnitOfMeasure)
  unitOfMeasure?: UnitOfMeasure;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/images/laptop-dell-001-updated.jpg',
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

  @ApiPropertyOptional({
    description: 'Estado activo del producto',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
