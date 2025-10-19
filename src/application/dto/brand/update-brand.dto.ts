import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @ApiPropertyOptional({
    description: 'Nombre de la marca',
    example: 'Samsung',
    minLength: 2,
    maxLength: 100,
  })
  name?: string;
}
