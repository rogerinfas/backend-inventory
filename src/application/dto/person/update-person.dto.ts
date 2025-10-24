import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePersonDto {
  @ApiPropertyOptional({ 
    description: 'Nombres completos de la persona', 
    example: 'Juan Carlos Pérez García',
    minLength: 2,
    maxLength: 100
  })
  @IsOptional()
  @IsString({ message: 'Los nombres deben ser una cadena' })
  @MinLength(2, { message: 'Los nombres deben tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'Los nombres no pueden tener más de 100 caracteres' })
  names?: string;

  @ApiPropertyOptional({ 
    description: 'Número de teléfono', 
    example: '+51987654321',
    minLength: 7,
    maxLength: 15
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena' })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 dígitos' })
  @MaxLength(15, { message: 'El teléfono no puede tener más de 15 dígitos' })
  phone?: string;
}
