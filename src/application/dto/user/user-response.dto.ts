import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class UserResponseDto {
  @ApiProperty({ description: 'ID único del usuario' })
  id: string;

  @ApiProperty({ description: 'ID de la tienda' })
  storeId: string;

  @ApiProperty({ description: 'ID de la persona' })
  personId: string;

  @ApiProperty({ description: 'Correo electrónico' })
  email: string;

  @ApiProperty({ enum: UserRole, description: 'Rol del usuario' })
  role: UserRole;

  @ApiProperty({ enum: EntityStatus, description: 'Estado del usuario' })
  status: EntityStatus;

  @ApiProperty({ description: 'Fecha del último login', required: false })
  lastLoginAt?: Date;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  updatedAt: Date;
}
