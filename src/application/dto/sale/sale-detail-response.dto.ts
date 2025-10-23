import { ApiProperty } from '@nestjs/swagger';

export class SaleDetailResponseDto {
  @ApiProperty({
    description: 'ID único del detalle de venta',
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
    example: 2
  })
  quantity: number;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 50.00
  })
  unitPrice: number;

  @ApiProperty({
    description: 'Descuento aplicado al producto',
    example: 5.00
  })
  discount: number;

  @ApiProperty({
    description: 'Subtotal del detalle (cantidad × precio unitario)',
    example: 100.00
  })
  subtotal: number;

  @ApiProperty({
    description: 'Total del detalle con descuento aplicado',
    example: 95.00
  })
  totalWithDiscount: number;

  @ApiProperty({
    description: 'Porcentaje de descuento aplicado',
    example: 5.00
  })
  discountPercentage: number;
}
