import { IsNumber, IsString, IsOptional, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStockDto {
  @ApiProperty({
    description: 'Nueva cantidad de stock para el producto',
    example: 50,
    minimum: 0,
    maximum: 999999,
    type: 'integer'
  })
  @IsNumber()
  @Min(0)
  @Max(999999)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Razón o motivo del cambio de stock',
    example: 'Inventario inicial',
    minLength: 2,
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  reason?: string;
}

export class AddStockDto {
  @ApiProperty({
    description: 'Cantidad de stock a agregar al producto',
    example: 25,
    minimum: 1,
    maximum: 999999,
    type: 'integer'
  })
  @IsNumber()
  @Min(1)
  @Max(999999)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Razón o motivo de la adición de stock',
    example: 'Compra de mercadería',
    minLength: 2,
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  reason?: string;
}

export class RemoveStockDto {
  @ApiProperty({
    description: 'Cantidad de stock a remover del producto',
    example: 5,
    minimum: 1,
    maximum: 999999,
    type: 'integer'
  })
  @IsNumber()
  @Min(1)
  @Max(999999)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Razón o motivo de la remoción de stock',
    example: 'Venta realizada',
    minLength: 2,
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  reason?: string;
}
