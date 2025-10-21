import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SaleStatus } from '../../../domain/enums/sale-status.enum';
import { SaleDocumentType } from '../../../domain/enums/sale-document-type.enum';

export class SaleDetailResponseDto {
  @ApiProperty({
    description: 'ID del detalle de venta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID de la venta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  saleId: string;

  @ApiProperty({
    description: 'ID del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  productId: string;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 25.50,
  })
  unitPrice: number;

  @ApiProperty({
    description: 'Descuento aplicado al detalle',
    example: 5.00,
  })
  discount: number;

  @ApiProperty({
    description: 'Subtotal del detalle (quantity * unitPrice - discount)',
    example: 46.00,
  })
  subtotal: number;
}

export class SaleResponseDto {
  @ApiProperty({
    description: 'ID de la venta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  storeId: string;

  @ApiProperty({
    description: 'ID del cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  customerId: string;

  @ApiProperty({
    description: 'ID del usuario que realizó la venta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'Número de documento de la venta',
    example: 'F001-00000001',
  })
  documentNumber?: string;

  @ApiProperty({
    description: 'Tipo de documento de venta',
    enum: SaleDocumentType,
    example: SaleDocumentType.INVOICE,
  })
  documentType: SaleDocumentType;

  @ApiProperty({
    description: 'Fecha de la venta',
    example: '2025-10-20T10:30:00.000Z',
  })
  saleDate: Date;

  @ApiProperty({
    description: 'Subtotal de la venta',
    example: 100.00,
  })
  subtotal: number;

  @ApiProperty({
    description: 'Impuesto aplicado',
    example: 18.00,
  })
  tax: number;

  @ApiProperty({
    description: 'Descuento aplicado',
    example: 10.00,
  })
  discount: number;

  @ApiProperty({
    description: 'Total de la venta',
    example: 108.00,
  })
  total: number;

  @ApiProperty({
    description: 'Estado de la venta',
    enum: SaleStatus,
    example: SaleStatus.PENDING,
  })
  status: SaleStatus;

  @ApiPropertyOptional({
    description: 'Notas adicionales',
    example: 'Venta con descuento especial',
  })
  notes?: string;

  @ApiProperty({
    description: 'Fecha de registro',
    example: '2025-10-20T10:30:00.000Z',
  })
  registeredAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-10-20T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Detalles de la venta',
    type: [SaleDetailResponseDto],
  })
  details: SaleDetailResponseDto[];
}
