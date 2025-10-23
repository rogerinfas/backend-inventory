import { IsUUID, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSaleDetailDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  productId: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Cantidad de productos',
    example: 2,
    minimum: 1
  })
  quantity: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 50.00,
    minimum: 0.01
  })
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Descuento aplicado al producto',
    example: 5.00,
    minimum: 0,
    default: 0
  })
  discount?: number = 0;
}
