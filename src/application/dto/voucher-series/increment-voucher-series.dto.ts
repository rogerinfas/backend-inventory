import { IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IncrementVoucherSeriesDto {
  @IsNumber({}, { message: 'El incremento debe ser un número' })
  @Min(1, { message: 'El incremento debe ser mayor a 0' })
  @ApiProperty({
    description: 'Cantidad a incrementar',
    example: 1,
    minimum: 1,
  })
  increment: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Razón del incremento',
    example: 'Venta realizada',
    maxLength: 500,
  })
  reason?: string;
}
