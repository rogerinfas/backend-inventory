import { IsEnum, IsString, IsEmail, MinLength, MaxLength, Matches, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../../domain/enums/document-type.enum';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { IsValidDocumentNumber } from '../../validators';

export class CreateUserWithPersonDto {
  @IsEnum(DocumentType, { message: 'El tipo de documento debe ser DNI, RUC, CE o PASSPORT' })
  @ApiProperty({ 
    enum: DocumentType, 
    description: 'Tipo de documento',
    example: DocumentType.DNI
  })
  documentType: DocumentType;

  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  @IsValidDocumentNumber({ message: 'El formato del número de documento no es válido para el tipo seleccionado' })
  @ApiProperty({ 
    description: 'Número de documento',
    example: '12345678'
  })
  documentNumber: string;

  @IsString({ message: 'Los nombres deben ser una cadena de texto' })
  @MinLength(2, { message: 'Los nombres deben tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'Los nombres no pueden exceder 100 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'Los nombres solo pueden contener letras y espacios' })
  @ApiProperty({ 
    description: 'Nombres completos',
    example: 'Juan Carlos Pérez'
  })
  names: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^\+51[0-9]{9}$/, { message: 'El formato del teléfono no es válido. Use formato +51XXXXXXXXX' })
  @ApiProperty({ 
    description: 'Teléfono en formato +51XXXXXXXXX',
    example: '+51987654321'
  })
  phone: string;

  @IsEmail({}, { message: 'El formato del email no es válido' })
  @ApiProperty({ 
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@ejemplo.com'
  })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(100, { message: 'La contraseña no puede exceder 100 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial'
  })
  @ApiProperty({ 
    description: 'Contraseña (mínimo 8 caracteres, debe incluir mayúscula, minúscula, número y carácter especial)',
    minLength: 8,
    maxLength: 100,
    example: 'MiPassword123!'
  })
  password: string;

  @IsUUID('4', { message: 'El ID de la tienda debe ser un UUID válido' })
  @ApiProperty({ 
    description: 'ID de la tienda',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  storeId: string;
}
