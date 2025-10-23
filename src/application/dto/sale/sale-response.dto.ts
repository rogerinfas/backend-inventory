import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VoucherType, SaleStatus } from '../../../domain/enums';
import { SaleDetailResponseDto } from './sale-detail-response.dto';

export class SaleResponseDto {
  @ApiProperty({
    description: 'ID único de la venta',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'ID único de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  storeId: string;

  @ApiProperty({
    description: 'ID único del cliente',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  customerId: string;

  @ApiProperty({
    description: 'ID único del usuario vendedor',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'Número de documento de la venta',
    example: 'B001-00000001'
  })
  documentNumber?: string;

  @ApiProperty({
    description: 'Tipo de comprobante de venta',
    enum: VoucherType,
    example: VoucherType.RECEIPT
  })
  documentType: VoucherType;

  @ApiProperty({
    description: 'Serie del comprobante',
    example: 'B001'
  })
  series: string;

  @ApiProperty({
    description: 'Fecha de la venta',
    example: '2025-01-20T10:30:00.000Z'
  })
  saleDate: Date;

  @ApiProperty({
    description: 'Subtotal de la venta',
    example: 100.00
  })
  subtotal: number;

  @ApiProperty({
    description: 'Impuesto aplicado (IGV)',
    example: 18.00
  })
  tax: number;

  @ApiProperty({
    description: 'Descuento total aplicado',
    example: 10.00
  })
  discount: number;

  @ApiProperty({
    description: 'Total de la venta',
    example: 108.00
  })
  total: number;

  @ApiProperty({
    description: 'Estado de la venta',
    enum: SaleStatus,
    example: SaleStatus.COMPLETED
  })
  status: SaleStatus;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la venta',
    example: 'Venta al contado'
  })
  notes?: string;

  @ApiProperty({
    description: 'Fecha de registro de la venta',
    example: '2025-01-20T10:30:00.000Z'
  })
  registeredAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-01-20T10:30:00.000Z'
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Detalles de los productos vendidos',
    type: [SaleDetailResponseDto]
  })
  details: SaleDetailResponseDto[];

  @ApiProperty({
    description: 'Total de cantidad de productos',
    example: 5
  })
  totalQuantity: number;

  @ApiProperty({
    description: 'Total de descuentos aplicados',
    example: 15.00
  })
  totalDiscount: number;
}
