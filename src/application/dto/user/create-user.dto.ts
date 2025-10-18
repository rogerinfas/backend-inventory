import { IsUUID, IsEnum, IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/enums/user-role.enum';

export class CreateUserDto {
  @IsUUID()
  @ApiProperty({ 
    description: 'ID de la tienda',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  storeId: string;

  @IsUUID()
  @ApiProperty({ 
    description: 'ID de la persona',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  personId: string;

  @IsEmail()
  @ApiProperty({ 
    description: 'Correo electrónico',
    example: 'usuario@ejemplo.com'
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

}
