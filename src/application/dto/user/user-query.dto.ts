import { IsOptional, IsEnum, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class UserQueryDto {
  @IsOptional()
  @IsString({ message: 'El ID de la tienda debe ser una cadena de texto' })
  @ApiProperty({ 
    description: 'ID de la tienda', 
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  storeId?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser SUPERADMIN, ADMIN o SELLER' })
  @ApiProperty({ 
    enum: UserRole, 
    description: 'Rol del usuario', 
    required: false,
    example: UserRole.SELLER
  })
  role?: UserRole;

  @IsOptional()
  @IsEnum(EntityStatus, { message: 'El estado debe ser ACTIVE, INACTIVE, SUSPENDED o DELETED' })
  @ApiProperty({ 
    enum: EntityStatus, 
    description: 'Estado del usuario', 
    required: false,
    example: EntityStatus.ACTIVE
  })
  status?: EntityStatus;

  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  @ApiProperty({ 
    description: 'Término de búsqueda (nombre, email)', 
    required: false,
    example: 'juan'
  })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El número de página debe ser un número' })
  @Min(1, { message: 'El número de página debe ser mayor a 0' })
  @ApiProperty({ 
    description: 'Número de página', 
    required: false, 
    minimum: 1, 
    default: 1,
    example: 1
  })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(1, { message: 'El límite debe ser mayor a 0' })
  @Max(100, { message: 'El límite no puede exceder 100' })
  @ApiProperty({ 
    description: 'Elementos por página', 
    required: false, 
    minimum: 1, 
    maximum: 100, 
    default: 10,
    example: 10
  })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt', 'lastLoginAt', 'email'], { message: 'El campo de ordenamiento debe ser createdAt, updatedAt, lastLoginAt o email' })
  @ApiProperty({ 
    enum: ['createdAt', 'updatedAt', 'lastLoginAt', 'email'], 
    description: 'Campo por el cual ordenar', 
    required: false,
    default: 'createdAt',
    example: 'createdAt'
  })
  sortBy?: 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'email' = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'El orden debe ser asc o desc' })
  @ApiProperty({ 
    enum: ['asc', 'desc'], 
    description: 'Orden de clasificación', 
    required: false,
    default: 'desc',
    example: 'desc'
  })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
