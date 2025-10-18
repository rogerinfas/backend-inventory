import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';
import { DocumentType } from '../../../domain/enums/document-type.enum';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class PersonDataDto {
  @ApiProperty({ description: 'ID único de la persona' })
  id: string;

  @ApiProperty({ enum: DocumentType, description: 'Tipo de documento' })
  documentType: DocumentType;

  @ApiProperty({ description: 'Número de documento' })
  documentNumber: string;

  @ApiProperty({ description: 'Nombres completos' })
  names: string;

  @ApiProperty({ description: 'Razón social', required: false })
  legalName?: string;

  @ApiProperty({ description: 'Dirección', required: false })
  address?: string;

  @ApiProperty({ description: 'Teléfono' })
  phone: string;

  @ApiProperty({ description: 'Correo electrónico' })
  email: string;

  @ApiProperty({ enum: EntityStatus, description: 'Estado de la entidad' })
  status: EntityStatus;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  updatedAt: Date;
}

export class UserWithPersonResponseDto extends UserResponseDto {
  @ApiProperty({ description: 'Datos de la persona asociada' })
  person: PersonDataDto;
}
