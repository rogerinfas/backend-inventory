import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @ApiProperty({
    description: 'Nombre de la marca',
    example: 'Samsung',
    minLength: 2,
    maxLength: 100,
  })
  name: string;
}
