import { IsString, IsEnum, IsNumber, Min, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VoucherType } from '../../../domain/enums/voucher-type.enum';

export class CreateVoucherSeriesDto {
  @IsUUID(4, { message: 'El storeId debe ser un UUID válido' })
  @ApiProperty({
    description: 'ID de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  storeId: string;

  @IsEnum(VoucherType, {
    message: 'El tipo de comprobante debe ser: RECEIPT, INVOICE, SALE_NOTE, PROFORMA, CREDIT_NOTE, DEBIT_NOTE',
  })
  @ApiProperty({
    description: 'Tipo de comprobante',
    enum: VoucherType,
    example: VoucherType.RECEIPT,
  })
  voucherType: VoucherType;

  @IsString()
  @MaxLength(10, { message: 'La serie no puede exceder 10 caracteres' })
  @ApiProperty({
    description: 'Serie del comprobante',
    example: 'B001',
    maxLength: 10,
  })
  series: string;

  @IsNumber({}, { message: 'El número actual debe ser un número' })
  @Min(1, { message: 'El número actual debe ser mayor a 0' })
  @ApiProperty({
    description: 'Número actual de la serie',
    example: 1,
    minimum: 1,
  })
  currentNumber: number;
}
