import { IsOptional, IsUUID, IsEnum, IsDateString, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VoucherType, SaleStatus } from '../../../domain/enums';

export class SaleQueryDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filtrar por ID de tienda',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  storeId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filtrar por ID de cliente',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  customerId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filtrar por ID de usuario vendedor',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  userId?: string;

  @IsOptional()
  @IsEnum(SaleStatus)
  @ApiPropertyOptional({
    description: 'Filtrar por estado de venta',
    enum: SaleStatus,
    example: SaleStatus.COMPLETED
  })
  status?: SaleStatus;

  @IsOptional()
  @IsEnum(VoucherType)
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de comprobante',
    enum: VoucherType,
    example: VoucherType.RECEIPT
  })
  documentType?: VoucherType;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha de inicio del rango',
    example: '2025-01-01T00:00:00.000Z'
  })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha de fin del rango',
    example: '2025-01-31T23:59:59.999Z'
  })
  endDate?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Buscar por número de documento',
    example: 'B001-00000001'
  })
  documentNumber?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Filtrar por serie de comprobante',
    example: 'B001'
  })
  series?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Buscar por texto en número de documento, serie o notas',
    example: 'B001'
  })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    default: 1
  })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10
  })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'saleDate',
    default: 'saleDate'
  })
  sortBy?: string = 'saleDate';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Dirección del ordenamiento',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'desc'
  })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
