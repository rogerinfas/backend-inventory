import { IsEnum, IsOptional, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({ 
    enum: UserRole, 
    description: 'Rol del usuario', 
    required: false,
    example: UserRole.MANAGER
  })
  role?: UserRole;

  @IsOptional()
  @IsEnum(EntityStatus)
  @ApiProperty({ 
    enum: EntityStatus, 
    description: 'Estado del usuario', 
    required: false,
    example: EntityStatus.ACTIVE
  })
  status?: EntityStatus;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial'
  })
  @ApiProperty({ 
    description: 'Nueva contraseña (mínimo 8 caracteres, debe incluir mayúscula, minúscula, número y carácter especial)',
    required: false,
    minLength: 8,
    maxLength: 100,
    example: 'NuevaPassword456!'
  })
  password?: string;
}
