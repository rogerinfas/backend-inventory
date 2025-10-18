import { ApiProperty } from '@nestjs/swagger';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class SupplierResponseDto {
  @ApiProperty({
    description: 'ID único del proveedor',
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
    description: 'Estado del proveedor',
    enum: EntityStatus,
    example: EntityStatus.ACTIVE,
  })
  status: EntityStatus;

  @ApiProperty({
    description: 'Fecha de creación del proveedor',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
