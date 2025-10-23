import { IsOptional, IsString, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSaleDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({
    description: 'Número de documento de la venta',
    example: 'B001-00000001',
    maxLength: 50
  })
  documentNumber?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({
    description: 'Descuento total aplicado',
    example: 15.00,
    minimum: 0
  })
  discount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la venta',
    example: 'Venta con descuento especial',
    maxLength: 500
  })
  notes?: string;
}
