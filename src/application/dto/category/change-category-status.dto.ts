import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class ChangeCategoryStatusDto {
  @IsEnum(EntityStatus, {
    message: 'El estado debe ser: ACTIVE, INACTIVE, SUSPENDED, DELETED',
  })
  @ApiProperty({
    description: 'Nuevo estado de la categoría',
    enum: EntityStatus,
    example: EntityStatus.ACTIVE,
  })
  status: EntityStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La razón no puede exceder 500 caracteres' })
  @ApiPropertyOptional({
    description: 'Razón del cambio de estado',
    example: 'Categoría activada por solicitud del administrador',
    maxLength: 500,
  })
  reason?: string;
}
