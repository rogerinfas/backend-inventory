import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'admin@admin.com'
  })
  email: string;

  @ApiProperty({
    description: 'Nombres de la persona asociada',
    example: 'Juan Pérez',
    required: false
  })
  names?: string;

  @ApiProperty({
    description: 'Rol del usuario',
    example: 'ADMIN'
  })
  role: string;

  @ApiProperty({
    description: 'Indica si el usuario está activo',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Teléfono de la persona asociada',
    example: '999888777',
    required: false
  })
  phone?: string;

  @ApiProperty({
    description: 'Tipo de documento de la persona asociada',
    example: 'DNI',
    required: false
  })
  documentType?: string;

  @ApiProperty({
    description: 'Número de documento de la persona asociada',
    example: '12345678',
    required: false
  })
  documentNumber?: string;

  @ApiProperty({
    description: 'ID de la tienda asociada',
    example: 'store-id-123',
    required: false
  })
  storeId?: string;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2024-01-01T00:00:00.000Z'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2024-01-01T00:00:00.000Z'
  })
  updatedAt: string;
}
