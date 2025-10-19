import { ApiProperty } from '@nestjs/swagger';
import { VoucherType } from '../../../domain/enums/voucher-type.enum';

export class VoucherSeriesResponseDto {
  @ApiProperty({
    description: 'ID único de la serie de comprobantes',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  storeId: string;

  @ApiProperty({
    description: 'Tipo de comprobante',
    enum: VoucherType,
    example: VoucherType.RECEIPT,
  })
  voucherType: VoucherType;

  @ApiProperty({
    description: 'Serie del comprobante',
    example: 'B001',
  })
  series: string;

  @ApiProperty({
    description: 'Número actual de la serie',
    example: 1,
  })
  currentNumber: number;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
