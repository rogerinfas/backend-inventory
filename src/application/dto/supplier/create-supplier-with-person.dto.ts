import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail, IsUUID, IsEnum, Matches, MinLength, MaxLength } from 'class-validator';
import { DocumentType } from '../../../domain/enums/document-type.enum';
import { IsValidDocumentNumber } from '../../validators/document-number.validator';

export class CreateSupplierWithPersonDto {
  @ApiProperty({
    description: 'Tipo de documento de la persona',
    enum: DocumentType,
    example: 'DNI'
  })
  @IsEnum(DocumentType, { message: 'El tipo de documento debe ser DNI, RUC, CE o PASSPORT' })
  documentType: DocumentType;

  @ApiProperty({
    description: 'Número de documento de la persona',
    example: '12345678'
  })
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El número de documento es requerido' })
  @IsValidDocumentNumber({ message: 'El formato del número de documento no es válido para el tipo seleccionado' })
  documentNumber: string;

  @ApiProperty({
    description: 'Nombres de la persona',
    example: 'María González'
  })
  @IsString({ message: 'Los nombres deben ser una cadena de texto' })
  @IsNotEmpty({ message: 'Los nombres son requeridos' })
  @MinLength(2, { message: 'Los nombres deben tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'Los nombres no pueden exceder 100 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'Los nombres solo pueden contener letras y espacios' })
  names: string;

  @ApiProperty({
    description: 'Razón social (opcional)',
    example: 'María González S.A.C.',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La razón social debe ser una cadena de texto' })
  @MinLength(2, { message: 'La razón social debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'La razón social no puede exceder 100 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,-]+$/, { message: 'La razón social contiene caracteres no válidos' })
  legalName?: string;

  @ApiProperty({
    description: 'Dirección de la persona',
    example: 'Av. Comercial 456, Lima',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres' })
  @MaxLength(200, { message: 'La dirección no puede exceder 200 caracteres' })
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]+$/, { message: 'La dirección contiene caracteres no válidos' })
  address?: string;

  @ApiProperty({
    description: 'Teléfono de la persona',
    example: '+51987654322',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'El formato del teléfono no es válido. Use formato internacional: +51987654321' })
  phone?: string;

  @ApiProperty({
    description: 'Email de la persona',
    example: 'maria@example.com',
    required: false
  })
  @IsOptional()
  @IsEmail({}, { message: 'El formato del email no es válido' })
  @MaxLength(254, { message: 'El email no puede exceder 254 caracteres' })
  email?: string;

  @ApiProperty({
    description: 'ID de la tienda',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString({ message: 'El ID de la tienda debe ser una cadena de texto' })
  @IsUUID('4', { message: 'El ID de la tienda debe ser un UUID válido' })
  storeId: string;
}
