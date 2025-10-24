import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType } from '../../../domain/enums/document-type.enum';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class PersonResponseDto {
  @ApiProperty({ description: 'ID único de la persona', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Tipo de documento', enum: DocumentType, example: DocumentType.DNI })
  documentType: DocumentType;

  @ApiProperty({ description: 'Número de documento', example: '12345678' })
  documentNumber: string;

  @ApiProperty({ description: 'Nombres completos', example: 'Juan Carlos Pérez García' })
  names: string;

  @ApiPropertyOptional({ description: 'Teléfono', example: '+51987654321' })
  phone: string | null;

  @ApiProperty({ description: 'Estado de la persona', enum: EntityStatus, example: EntityStatus.ACTIVE })
  status: EntityStatus;

  @ApiProperty({ description: 'Fecha de creación', example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2024-01-15T10:30:00.000Z' })
  updatedAt: Date;
}
