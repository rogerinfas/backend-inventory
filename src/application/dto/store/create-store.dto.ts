import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({
    description: 'Nombre comercial de la tienda',
    example: 'Mi Tienda de Tecnología',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @MinLength(2, { message: 'El nombre comercial debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre comercial no puede exceder 100 caracteres' })
  businessName: string;

  @ApiProperty({
    description: 'RUC de la tienda (11 dígitos)',
    example: '20123456789',
    pattern: '^[0-9]{11}$'
  })
  @IsString()
  @Matches(/^[0-9]{11}$/, { message: 'El RUC debe tener exactamente 11 dígitos' })
  ruc: string;

  @ApiPropertyOptional({
    description: 'Dirección de la tienda',
    example: 'Av. Principal 123, Lima, Perú',
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'La dirección no puede exceder 200 caracteres' })
  address?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de la tienda',
    example: '+51987654321',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'El teléfono no puede exceder 20 caracteres' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'URL del logo de la tienda',
    example: 'https://example.com/logo.png',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La URL del logo no puede exceder 500 caracteres' })
  logoUrl?: string;
}
