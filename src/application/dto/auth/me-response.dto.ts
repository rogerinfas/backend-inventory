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
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez'
  })
  fullName: string;

  @ApiProperty({
    description: 'Primer nombre del usuario',
    example: 'Juan'
  })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez'
  })
  lastName: string;

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
    description: 'Teléfono del usuario',
    example: '999888777',
    required: false
  })
  phone?: string;

  @ApiProperty({
    description: 'Tipo de documento',
    example: 'DNI'
  })
  documentType: string;

  @ApiProperty({
    description: 'Número de documento',
    example: '12345678'
  })
  documentNumber: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Av. Principal 123',
    required: false
  })
  address?: string;

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
