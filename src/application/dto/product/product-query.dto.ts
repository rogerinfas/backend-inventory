import { IsOptional, IsEnum, IsString, IsBoolean, IsUUID, MaxLength, Min, Max, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UnitOfMeasure } from '../../../domain/enums/unit-of-measure.enum';

export class ProductQueryDto {
  @ApiPropertyOptional({
    description: 'ID de la tienda para filtrar productos',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsOptional()
  @IsUUID()
  storeId?: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría para filtrar productos',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid'
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'ID de la marca para filtrar productos',
    example: '123e4567-e89b-12d3-a456-426614174002',
    format: 'uuid'
  })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado activo del producto',
    example: true,
    type: 'boolean'
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Búsqueda por nombre, SKU o descripción del producto',
    example: 'laptop',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar productos con stock bajo (stock actual <= stock mínimo)',
    example: true,
    type: 'boolean'
  })
  @IsOptional()
  @IsBoolean()
  lowStock?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar productos sin stock (stock actual = 0)',
    example: true,
    type: 'boolean'
  })
  @IsOptional()
  @IsBoolean()
  outOfStock?: boolean;

  @ApiPropertyOptional({
    description: 'Número de página para paginación',
    example: 1,
    minimum: 1,
    maximum: 1000,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000)
  page?: number;

  @ApiPropertyOptional({
    description: 'Límite de resultados por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Campo para ordenar los resultados',
    example: 'name',
    enum: ['name', 'sku', 'currentStock', 'salePrice', 'createdAt', 'updatedAt'],
    default: 'createdAt'
  })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'sku', 'currentStock', 'salePrice', 'createdAt', 'updatedAt'])
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Orden de clasificación',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'desc'
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
