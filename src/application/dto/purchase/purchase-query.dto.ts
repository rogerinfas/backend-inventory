import { IsOptional, IsEnum, IsUUID, IsDateString, IsString, IsNumber, Min, Max, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PurchaseStatus, PurchaseDocumentType } from '../../../domain/enums';

export class PurchaseQueryDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filtrar por ID de tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  storeId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filtrar por ID de proveedor',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  supplierId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filtrar por ID de usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  userId?: string;

  @IsOptional()
  @IsEnum(PurchaseStatus)
  @ApiPropertyOptional({
    description: 'Filtrar por estado de compra',
    enum: PurchaseStatus,
    example: PurchaseStatus.REGISTERED
  })
  status?: PurchaseStatus;

  @IsOptional()
  @IsEnum(PurchaseDocumentType)
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de documento',
    enum: PurchaseDocumentType,
    example: PurchaseDocumentType.INVOICE
  })
  documentType?: PurchaseDocumentType;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha de inicio para filtrar compras',
    example: '2025-01-01T00:00:00.000Z',
    format: 'date-time'
  })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha de fin para filtrar compras',
    example: '2025-01-31T23:59:59.999Z',
    format: 'date-time'
  })
  endDate?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @ApiPropertyOptional({
    description: 'Filtrar por número de documento',
    example: 'F001-00000001',
    maxLength: 50
  })
  documentNumber?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000)
  @ApiPropertyOptional({
    description: 'Número de página para paginación',
    example: 1,
    minimum: 1,
    maximum: 1000
  })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({
    description: 'Límite de resultados por página',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Campo para ordenar los resultados',
    example: 'purchaseDate',
    enum: ['purchaseDate', 'total', 'status', 'registeredAt']
  })
  sortBy?: 'purchaseDate' | 'total' | 'status' | 'registeredAt' = 'purchaseDate';

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Orden de clasificación',
    example: 'desc',
    enum: ['asc', 'desc']
  })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
