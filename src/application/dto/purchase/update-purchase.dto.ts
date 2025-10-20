import { IsUUID, IsEnum, IsOptional, IsString, IsDateString, IsNumber, IsPositive, IsArray, ValidateNested, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PurchaseDocumentType, PurchaseStatus } from '../../../domain/enums';

export class UpdatePurchaseDetailDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID único del detalle de compra',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  id: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  productId: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Cantidad de productos',
    example: 10,
    minimum: 1
  })
  quantity: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 25.50,
    minimum: 0.01
  })
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Descuento aplicado al producto',
    example: 2.50,
    minimum: 0,
    default: 0
  })
  discount?: number = 0;
}

export class UpdatePurchaseDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @ApiPropertyOptional({
    description: 'Número de documento de la compra',
    example: 'F001-00000001',
    maxLength: 50
  })
  documentNumber?: string;

  @IsOptional()
  @IsEnum(PurchaseDocumentType)
  @ApiPropertyOptional({
    description: 'Tipo de documento de compra',
    enum: PurchaseDocumentType,
    example: PurchaseDocumentType.INVOICE
  })
  documentType?: PurchaseDocumentType;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Fecha de la compra',
    example: '2025-01-20T10:30:00.000Z',
    format: 'date-time'
  })
  purchaseDate?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiPropertyOptional({
    description: 'Subtotal de la compra',
    example: 250.00,
    minimum: 0.01
  })
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Impuesto aplicado',
    example: 45.00,
    minimum: 0,
    default: 0
  })
  tax?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Descuento total aplicado',
    example: 10.00,
    minimum: 0,
    default: 0
  })
  discount?: number;

  @IsOptional()
  @IsEnum(PurchaseStatus)
  @ApiPropertyOptional({
    description: 'Estado de la compra',
    enum: PurchaseStatus,
    example: PurchaseStatus.REGISTERED
  })
  status?: PurchaseStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la compra',
    example: 'Compra urgente para reposición de stock',
    maxLength: 500
  })
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePurchaseDetailDto)
  @ApiPropertyOptional({
    description: 'Detalles de los productos comprados',
    type: [UpdatePurchaseDetailDto]
  })
  details?: UpdatePurchaseDetailDto[];
}
