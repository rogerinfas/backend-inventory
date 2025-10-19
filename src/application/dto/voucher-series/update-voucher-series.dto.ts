import { IsString, IsEnum, IsNumber, Min, MaxLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VoucherType } from '../../../domain/enums/voucher-type.enum';

export class UpdateVoucherSeriesDto {
  @IsOptional()
  @IsEnum(VoucherType, {
    message: 'El tipo de comprobante debe ser: RECEIPT, INVOICE, SALE_NOTE, PROFORMA, CREDIT_NOTE, DEBIT_NOTE',
  })
  @ApiPropertyOptional({
    description: 'Tipo de comprobante',
    enum: VoucherType,
    example: VoucherType.RECEIPT,
  })
  voucherType?: VoucherType;

  @IsOptional()
  @IsString()
  @MaxLength(10, { message: 'La serie no puede exceder 10 caracteres' })
  @ApiPropertyOptional({
    description: 'Serie del comprobante',
    example: 'B001',
    maxLength: 10,
  })
  series?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El número actual debe ser un número' })
  @Min(1, { message: 'El número actual debe ser mayor a 0' })
  @ApiPropertyOptional({
    description: 'Número actual de la serie',
    example: 1,
    minimum: 1,
  })
  currentNumber?: number;
}
