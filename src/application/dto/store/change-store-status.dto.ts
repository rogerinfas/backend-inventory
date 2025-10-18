import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class ChangeStoreStatusDto {
  @ApiProperty({
    description: 'Nuevo estado de la tienda',
    enum: EntityStatus,
    example: EntityStatus.INACTIVE
  })
  @IsEnum(EntityStatus, { message: 'El estado debe ser un valor válido' })
  status: EntityStatus;

  @ApiPropertyOptional({
    description: 'Razón del cambio de estado',
    example: 'Solicitud del administrador',
    maxLength: 200
  })
  @IsOptional()
  @IsString({ message: 'La razón debe ser una cadena de texto' })
  @MaxLength(200, { message: 'La razón no puede exceder 200 caracteres' })
  reason?: string;
}
