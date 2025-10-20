import { IsUUID, IsEnum, IsOptional, IsString, IsDateString, IsNumber, IsPositive, IsArray, ValidateNested, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PurchaseDocumentType, PurchaseStatus } from '../../../domain/enums';

export class CreatePurchaseDetailDto {
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

export class CreatePurchaseDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID único de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  storeId: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID único del proveedor',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  supplierId: string;

  @IsUUID()
  @ApiProperty({
    description: 'ID único del usuario que registra la compra',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  userId: string;

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

  @IsEnum(PurchaseDocumentType)
  @ApiProperty({
    description: 'Tipo de documento de compra',
    enum: PurchaseDocumentType,
    example: PurchaseDocumentType.INVOICE
  })
  documentType: PurchaseDocumentType;

  @IsDateString()
  @ApiProperty({
    description: 'Fecha de la compra',
    example: '2025-01-20T10:30:00.000Z',
    format: 'date-time'
  })
  purchaseDate: string;


  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Impuesto aplicado',
    example: 45.00,
    minimum: 0,
    default: 0
  })
  tax?: number = 0;

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
    description: 'Notas adicionales sobre la compra',
    example: 'Compra urgente para reposición de stock',
    maxLength: 500
  })
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseDetailDto)
  @ApiProperty({
    description: 'Detalles de los productos comprados',
    type: [CreatePurchaseDetailDto],
    minItems: 1
  })
  details: CreatePurchaseDetailDto[];
}
