import { IsEnum, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class ChangePersonStatusDto {
  @ApiProperty({ 
    description: 'Nuevo estado de la persona', 
    enum: EntityStatus,
    example: EntityStatus.ACTIVE 
  })
  @IsEnum(EntityStatus, { message: 'Estado no válido' })
  status: EntityStatus;

  @ApiPropertyOptional({ 
    description: 'Razón del cambio de estado (opcional)', 
    example: 'Reactivación por solicitud del cliente',
    maxLength: 500
  })
  @IsOptional()
  @IsString({ message: 'La razón debe ser una cadena' })
  @MaxLength(500, { message: 'La razón no puede tener más de 500 caracteres' })
  reason?: string;
}
