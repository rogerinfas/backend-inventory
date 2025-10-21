import { IsString, IsUUID, IsOptional, IsEnum, IsDateString, IsNumber, IsArray, ValidateNested, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SaleDocumentType } from '../../../domain/enums/sale-document-type.enum';

export class CreateSaleDetailDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  productId: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2,
    minimum: 1,
  })
  quantity: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 25.50,
    minimum: 0,
  })
  unitPrice: number;

  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    description: 'Descuento aplicado al detalle',
    example: 5.00,
    minimum: 0,
    default: 0,
  })
  discount?: number = 0;
}

export class CreateSaleDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  storeId: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID del cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  customerId: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID del usuario que realiza la venta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Número de documento de la venta',
    example: 'F001-00000001',
  })
  documentNumber?: string;

  @IsEnum(SaleDocumentType)
  @ApiProperty({
    description: 'Tipo de documento de venta',
    enum: SaleDocumentType,
    example: SaleDocumentType.INVOICE,
  })
  documentType: SaleDocumentType;

  @IsDateString()
  @ApiProperty({
    description: 'Fecha de la venta',
    example: '2025-10-20T10:30:00.000Z',
  })
  saleDate: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Impuesto aplicado',
    example: 18.00,
    minimum: 0,
    default: 0,
  })
  tax: number = 0;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Descuento aplicado a la venta',
    example: 10.00,
    minimum: 0,
    default: 0,
  })
  discount: number = 0;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Notas adicionales de la venta',
    example: 'Venta con descuento especial',
  })
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDetailDto)
  @ApiProperty({
    description: 'Detalles de la venta',
    type: [CreateSaleDetailDto],
  })
  details: CreateSaleDetailDto[];
}
