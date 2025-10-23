import { IsUUID, IsEnum, IsOptional, IsString, IsDateString, IsNumber, IsArray, ValidateNested, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VoucherType } from '../../../domain/enums';
import { CreateSaleDetailDto } from './create-sale-detail.dto';

export class CreateSaleDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID único de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  storeId: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID único del cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  customerId: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID único del usuario vendedor',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  userId: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @ApiPropertyOptional({
    description: 'Número de documento de la venta',
    example: 'B001-00000001',
    maxLength: 50
  })
  documentNumber?: string;

  @IsEnum(VoucherType)
  @ApiProperty({
    description: 'Tipo de comprobante de venta',
    enum: VoucherType,
    example: VoucherType.RECEIPT
  })
  documentType: VoucherType;

  @IsString()
  @MinLength(1)
  @MaxLength(10)
  @ApiProperty({
    description: 'Serie del comprobante',
    example: 'B001',
    maxLength: 10
  })
  series: string;

  @IsDateString()
  @ApiProperty({
    description: 'Fecha de la venta',
    example: '2025-01-20T10:30:00.000Z',
    format: 'date-time'
  })
  saleDate: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Descuento total aplicado',
    example: 10.00,
    minimum: 0,
    default: 0
  })
  discount?: number = 0;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la venta',
    example: 'Venta al contado',
    maxLength: 500
  })
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDetailDto)
  @ApiProperty({
    description: 'Detalles de los productos vendidos',
    type: [CreateSaleDetailDto],
    minItems: 1
  })
  details: CreateSaleDetailDto[];
}
