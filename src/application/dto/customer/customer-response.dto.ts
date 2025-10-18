import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class CustomerResponseDto {
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
}
