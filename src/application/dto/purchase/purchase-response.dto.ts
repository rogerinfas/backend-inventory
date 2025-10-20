import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PurchaseDocumentType, PurchaseStatus } from '../../../domain/enums';

export class PurchaseDetailResponseDto {
  @ApiProperty({
    description: 'ID único del detalle de compra',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  productId: string;

  @ApiProperty({
    description: 'Cantidad de productos',
    example: 10
  })
  quantity: number;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 25.50
  })
  unitPrice: number;

  @ApiProperty({
    description: 'Descuento aplicado al producto',
    example: 2.50
  })
  discount: number;

  @ApiProperty({
    description: 'Subtotal del detalle (cantidad × precio unitario)',
    example: 255.00
  })
  subtotal: number;

  @ApiProperty({
    description: 'Total del detalle con descuento aplicado',
    example: 252.50
  })
  totalWithDiscount: number;

  @ApiProperty({
    description: 'Porcentaje de descuento aplicado',
    example: 0.98
  })
  discountPercentage: number;
}

export class PurchaseResponseDto {
  @ApiProperty({
    description: 'ID único de la compra',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'ID único de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  storeId: string;

  @ApiProperty({
    description: 'ID único del proveedor',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  supplierId: string;

  @ApiProperty({
    description: 'ID único del usuario que registra la compra',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'Número de documento de la compra',
    example: 'F001-00000001'
  })
  documentNumber?: string;

  @ApiProperty({
    description: 'Tipo de documento de compra',
    enum: PurchaseDocumentType,
    example: PurchaseDocumentType.INVOICE
  })
  documentType: PurchaseDocumentType;

  @ApiProperty({
    description: 'Fecha de la compra',
    example: '2025-01-20T10:30:00.000Z'
  })
  purchaseDate: Date;

  @ApiProperty({
    description: 'Subtotal de la compra',
    example: 250.00
  })
  subtotal: number;

  @ApiProperty({
    description: 'Impuesto aplicado',
    example: 45.00
  })
  tax: number;

  @ApiProperty({
    description: 'Descuento total aplicado',
    example: 10.00
  })
  discount: number;

  @ApiProperty({
    description: 'Total de la compra',
    example: 285.00
  })
  total: number;

  @ApiProperty({
    description: 'Estado de la compra',
    enum: PurchaseStatus,
    example: PurchaseStatus.REGISTERED
  })
  status: PurchaseStatus;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la compra',
    example: 'Compra urgente para reposición de stock'
  })
  notes?: string;

  @ApiProperty({
    description: 'Fecha de registro de la compra',
    example: '2025-01-20T10:30:00.000Z'
  })
  registeredAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-01-20T10:30:00.000Z'
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Detalles de los productos comprados',
    type: [PurchaseDetailResponseDto]
  })
  details: PurchaseDetailResponseDto[];

  @ApiProperty({
    description: 'Total de cantidad de productos',
    example: 25
  })
  totalQuantity: number;

  @ApiProperty({
    description: 'Total de descuentos aplicados',
    example: 15.50
  })
  totalDiscount: number;
}
