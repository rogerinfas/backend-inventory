import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateStoreDto {
  @ApiPropertyOptional({
    description: 'Nombre comercial de la tienda',
    example: 'Mi Tienda de Tecnología Actualizada',
    minLength: 2,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre comercial debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre comercial no puede exceder 100 caracteres' })
  businessName?: string;

  @ApiPropertyOptional({
    description: 'Razón social de la tienda',
    example: 'Mi Tienda de Tecnología S.A.C. Actualizada',
    minLength: 2,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'La razón social debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'La razón social no puede exceder 100 caracteres' })
  legalName?: string;

  @ApiPropertyOptional({
    description: 'Dirección de la tienda',
    example: 'Av. Principal 456, Lima, Perú',
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'La dirección no puede exceder 200 caracteres' })
  address?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de la tienda',
    example: '+51987654322',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'El teléfono no puede exceder 20 caracteres' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email de la tienda',
    example: 'nuevo@mitienda.com',
    maxLength: 254
  })
  @IsOptional()
  @IsEmail({}, { message: 'El formato del email no es válido' })
  @MaxLength(254, { message: 'El email no puede exceder 254 caracteres' })
  email?: string;

  @ApiPropertyOptional({
    description: 'URL del logo de la tienda',
    example: 'https://example.com/nuevo-logo.png',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La URL del logo no puede exceder 500 caracteres' })
  logoUrl?: string;
}
