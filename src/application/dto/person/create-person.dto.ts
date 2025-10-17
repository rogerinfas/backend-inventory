import { IsEnum, IsString, IsOptional, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType } from '../../../domain/enums/document-type.enum';

export class CreatePersonDto {
  @ApiProperty({ 
    description: 'Tipo de documento de identidad', 
    enum: DocumentType,
    example: DocumentType.DNI 
  })
  @IsEnum(DocumentType, { message: 'Tipo de documento no válido' })
  documentType: DocumentType;

  @ApiProperty({ 
    description: 'Número de documento de identidad', 
    example: '12345678',
    minLength: 6,
    maxLength: 12
  })
  @IsString({ message: 'El número de documento debe ser una cadena' })
  @MinLength(6, { message: 'El número de documento debe tener al menos 6 caracteres' })
  @MaxLength(12, { message: 'El número de documento no puede tener más de 12 caracteres' })
  documentNumber: string;

  @ApiProperty({ 
    description: 'Nombres completos de la persona', 
    example: 'Juan Carlos Pérez García',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ message: 'Los nombres deben ser una cadena' })
  @MinLength(2, { message: 'Los nombres deben tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'Los nombres no pueden tener más de 100 caracteres' })
  names: string;

  @ApiPropertyOptional({ 
    description: 'Nombre legal o razón social (para personas jurídicas)', 
    example: 'Empresa ABC S.A.C.',
    maxLength: 100
  })
  @IsOptional()
  @IsString({ message: 'El nombre legal debe ser una cadena' })
  @MaxLength(100, { message: 'El nombre legal no puede tener más de 100 caracteres' })
  legalName?: string;

  @ApiPropertyOptional({ 
    description: 'Dirección de la persona', 
    example: 'Av. Principal 123, Lima, Perú',
    maxLength: 200
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena' })
  @MaxLength(200, { message: 'La dirección no puede tener más de 200 caracteres' })
  address?: string;

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

  @ApiPropertyOptional({ 
    description: 'Correo electrónico', 
    example: 'juan.perez@email.com',
    maxLength: 254
  })
  @IsOptional()
  @IsEmail({}, { message: 'El formato del email no es válido' })
  @MaxLength(254, { message: 'El email no puede tener más de 254 caracteres' })
  email?: string;
}
