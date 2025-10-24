import { IsOptional, IsString, IsEnum, IsNumber, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VoucherType } from '../../../domain/enums/voucher-type.enum';

export class VoucherSeriesQueryDto {
  @IsOptional()
  @IsUUID(4, { message: 'El storeId debe ser un UUID válido' })
  @ApiPropertyOptional({
    description: 'Filtrar por ID de tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  storeId?: string;

  @IsOptional()
  @IsEnum(VoucherType)
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de comprobante',
    enum: VoucherType,
    example: VoucherType.RECEIPT,
  })
  voucherType?: VoucherType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Buscar por serie',
    example: 'B001',
  })
  series?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La página debe ser un número' })
  @Min(1, { message: 'La página debe ser mayor a 0' })
  @Max(1000, { message: 'La página no puede exceder 1000' })
  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    maximum: 1000,
  })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(1, { message: 'El límite debe ser mayor a 0' })
  @Max(100, { message: 'El límite no puede exceder 100' })
  @ApiPropertyOptional({
    description: 'Elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Campo de ordenamiento',
    example: 'createdAt',
    enum: ['voucherType', 'series', 'currentNumber', 'createdAt', 'updatedAt'],
  })
  sortBy?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Orden de clasificación',
    example: 'asc',
    enum: ['asc', 'desc'],
  })
  sortOrder?: 'asc' | 'desc';
}
