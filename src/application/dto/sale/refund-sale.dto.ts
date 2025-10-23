import { IsArray, IsUUID, IsNumber, IsPositive, ValidateNested, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RefundSaleDetailDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID único del producto a devolver',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  productId: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Cantidad a devolver',
    example: 1,
    minimum: 1
  })
  quantity: number;
}

export class RefundSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RefundSaleDetailDto)
  @ApiProperty({
    description: 'Detalles de productos a devolver',
    type: [RefundSaleDetailDto],
    minItems: 1
  })
  details: RefundSaleDetailDto[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({
    description: 'Motivo de la devolución',
    example: 'Producto defectuoso',
    maxLength: 500
  })
  reason?: string;
}
