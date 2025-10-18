import { IsOptional, IsEnum, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class UserQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ 
    description: 'ID de la tienda', 
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  storeId?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({ 
    enum: UserRole, 
    description: 'Rol del usuario', 
    required: false,
    example: UserRole.SELLER
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
  @ApiProperty({ 
    description: 'Término de búsqueda (nombre, email)', 
    required: false,
    example: 'juan'
  })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
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
  @IsNumber()
  @Min(1)
  @Max(100)
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
  @IsEnum(['createdAt', 'updatedAt', 'lastLoginAt', 'email'])
  @ApiProperty({ 
    enum: ['createdAt', 'updatedAt', 'lastLoginAt', 'email'], 
    description: 'Campo por el cual ordenar', 
    required: false,
    default: 'createdAt',
    example: 'createdAt'
  })
  sortBy?: 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'email' = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @ApiProperty({ 
    enum: ['asc', 'desc'], 
    description: 'Orden de clasificación', 
    required: false,
    default: 'desc',
    example: 'desc'
  })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
