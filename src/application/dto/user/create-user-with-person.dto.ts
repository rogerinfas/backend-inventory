import { IsEnum, IsString, IsEmail, MinLength, MaxLength, Matches, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../../domain/enums/document-type.enum';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { IsValidDocumentNumber } from '../../validators';

export class CreateUserWithPersonDto {
  @IsEnum(DocumentType)
  @ApiProperty({ 
    enum: DocumentType, 
    description: 'Tipo de documento',
    example: DocumentType.DNI
  })
  documentType: DocumentType;

  @IsValidDocumentNumber()
  @ApiProperty({ 
    description: 'Número de documento',
    example: '12345678'
  })
  documentNumber: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'Los nombres solo pueden contener letras y espacios' })
  @ApiProperty({ 
    description: 'Nombres completos',
    example: 'Juan Carlos Pérez'
  })
  names: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,&-]+$/, { message: 'La razón social contiene caracteres no válidos' })
  @ApiProperty({ 
    description: 'Razón social', 
    required: false,
    example: 'Empresa ABC S.A.C.'
  })
  legalName?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]+$/, { message: 'La dirección contiene caracteres no válidos' })
  @ApiProperty({ 
    description: 'Dirección', 
    required: false,
    example: 'Av. Principal 123, Lima, Perú'
  })
  address?: string;

  @IsString()
  @Matches(/^\+51[0-9]{9}$/, { message: 'El formato del teléfono no es válido. Use formato +51XXXXXXXXX' })
  @ApiProperty({ 
    description: 'Teléfono en formato +51XXXXXXXXX',
    example: '+51987654321'
  })
  phone: string;

  @IsEmail({}, { message: 'El formato del email no es válido' })
  @ApiProperty({ 
    description: 'Correo electrónico de la persona',
    example: 'juan.perez@ejemplo.com'
  })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
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


  @IsUUID()
  @ApiProperty({ 
    description: 'ID de la tienda',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  storeId: string;
}
