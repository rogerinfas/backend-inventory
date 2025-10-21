import { IsOptional, IsString, IsEnum, IsDateString, IsNumber, Min, IsUUID } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { SaleStatus } from '../../../domain/enums/sale-status.enum';
import { SaleDocumentType } from '../../../domain/enums/sale-document-type.enum';
import { SaleResponseDto } from './sale-response.dto';

export class UpdateSaleDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Número de documento de la venta',
    example: 'F001-00000001',
  })
  documentNumber?: string;

  @IsOptional()
  @IsEnum(SaleDocumentType)
  @ApiPropertyOptional({
    description: 'Tipo de documento de venta',
    enum: SaleDocumentType,
    example: SaleDocumentType.INVOICE,
  })
  documentType?: SaleDocumentType;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha de la venta',
    example: '2025-10-20T10:30:00.000Z',
  })
  saleDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    description: 'Impuesto aplicado',
    example: 18.00,
    minimum: 0,
  })
  tax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    description: 'Descuento aplicado a la venta',
    example: 10.00,
    minimum: 0,
  })
  discount?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Notas adicionales de la venta',
    example: 'Venta con descuento especial',
  })
  notes?: string;
}

export class SaleQueryDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filtrar por ID de tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  storeId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filtrar por ID de cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  customerId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Filtrar por ID de usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId?: string;

  @IsOptional()
  @IsEnum(SaleStatus)
  @ApiPropertyOptional({
    description: 'Filtrar por estado de venta',
    enum: SaleStatus,
    example: SaleStatus.PENDING,
  })
  status?: SaleStatus;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha de inicio para filtrar ventas',
    example: '2025-10-01T00:00:00.000Z',
  })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha de fin para filtrar ventas',
    example: '2025-10-31T23:59:59.999Z',
  })
  endDate?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Búsqueda por número de documento o notas',
    example: 'F001-00000001',
  })
  search?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    description: 'Número de registros a omitir',
    example: 0,
    minimum: 0,
    default: 0,
  })
  offset?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Número máximo de registros a retornar',
    example: 10,
    minimum: 1,
    default: 10,
  })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'registeredAt',
    default: 'registeredAt',
  })
  sortBy?: string = 'registeredAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @ApiPropertyOptional({
    description: 'Orden de clasificación',
    enum: ['asc', 'desc'],
    example: 'desc',
    default: 'desc',
  })
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class ListSalesResponseDto {
  @ApiProperty({
    description: 'Lista de ventas',
    type: [SaleResponseDto],
  })
  sales: SaleResponseDto[];

  @ApiProperty({
    description: 'Número total de ventas que coinciden con los filtros',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Número de registros omitidos',
    example: 0,
  })
  offset: number;

  @ApiProperty({
    description: 'Número máximo de registros solicitados',
    example: 10,
  })
  limit: number;
}
