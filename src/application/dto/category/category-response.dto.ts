import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'ID único de la categoría',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Laptops',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción de la categoría',
    example: 'Computadoras portátiles y laptops',
  })
  description: string | null;

  @ApiProperty({
    description: 'Estado de la categoría',
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
    description: 'Fecha de actualización',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
