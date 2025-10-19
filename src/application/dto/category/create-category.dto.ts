import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Laptops',
    minLength: 2,
    maxLength: 100,
  })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  @ApiPropertyOptional({
    description: 'Descripción de la categoría',
    example: 'Computadoras portátiles y laptops',
    maxLength: 500,
  })
  description?: string;
}
