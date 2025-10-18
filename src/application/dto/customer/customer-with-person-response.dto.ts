import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';
import { DocumentType } from '../../../domain/enums/document-type.enum';

export class PersonDataDto {
  @ApiProperty({
    description: 'ID único de la persona',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Tipo de documento',
    enum: DocumentType,
    example: DocumentType.DNI,
  })
  documentType: DocumentType;

  @ApiProperty({
    description: 'Número de documento',
    example: '12345678',
  })
  documentNumber: string;

  @ApiProperty({
    description: 'Nombres de la persona',
    example: 'Juan Carlos',
  })
  names: string;

  @ApiPropertyOptional({
    description: 'Razón social',
    example: 'Juan Carlos S.A.C.',
  })
  legalName?: string;

  @ApiPropertyOptional({
    description: 'Dirección',
    example: 'Av. Principal 123, Lima',
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'Teléfono',
    example: '+51987654321',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Email',
    example: 'juan@example.com',
  })
  email?: string;

  @ApiProperty({
    description: 'Estado de la persona',
    enum: EntityStatus,
    example: EntityStatus.ACTIVE,
  })
  status: EntityStatus;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}

export class CustomerWithPersonResponseDto {
  @ApiProperty({
    description: 'ID único del cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  storeId: string;

  @ApiProperty({
    description: 'ID de la persona',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  personId: string;

  @ApiProperty({
    description: 'Estado del cliente',
    enum: EntityStatus,
    example: EntityStatus.ACTIVE,
  })
  status: EntityStatus;

  @ApiProperty({
    description: 'Fecha de registro del cliente',
    example: '2024-01-15T10:30:00.000Z',
  })
  registeredAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Datos de la persona asociada',
    type: PersonDataDto,
  })
  person: PersonDataDto;
}
