import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class ChangeSupplierStatusDto {
  @ApiProperty({
    description: 'Nuevo estado del proveedor',
    enum: EntityStatus,
    example: EntityStatus.ACTIVE,
  })
  @IsEnum(EntityStatus, { message: 'El estado debe ser ACTIVE, INACTIVE, SUSPENDED o DELETED' })
  status: EntityStatus;

  @ApiPropertyOptional({
    description: 'Razón del cambio de estado',
    example: 'Solicitud del proveedor',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'La razón debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La razón no puede exceder 255 caracteres' })
  reason?: string;
}
