import { IsOptional, IsString, IsEnum, IsDateString, IsNumber, Min, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SaleStatus } from '../../../domain/enums/sale-status.enum';
import { SaleDocumentType } from '../../../domain/enums/sale-document-type.enum';

export class SaleQueryFiltersDto {
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
