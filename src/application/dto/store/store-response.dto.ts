import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class StoreResponseDto {
  @ApiProperty({
    description: 'ID único de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Nombre comercial de la tienda',
    example: 'Mi Tienda de Tecnología'
  })
  businessName: string;

  @ApiProperty({
    description: 'RUC de la tienda',
    example: '20123456789'
  })
  ruc: string;

  @ApiProperty({
    description: 'Razón social de la tienda',
    example: 'Mi Tienda de Tecnología S.A.C.'
  })
  legalName: string;

  @ApiPropertyOptional({
    description: 'Dirección de la tienda',
    example: 'Av. Principal 123, Lima, Perú'
  })
  address: string | null;

  @ApiPropertyOptional({
    description: 'Teléfono de la tienda',
    example: '+51987654321'
  })
  phone: string | null;

  @ApiPropertyOptional({
    description: 'Email de la tienda',
    example: 'contacto@mitienda.com'
  })
  email: string | null;

  @ApiPropertyOptional({
    description: 'URL del logo de la tienda',
    example: 'https://example.com/logo.png'
  })
  logoUrl: string | null;

  @ApiProperty({
    description: 'Estado de la tienda',
    enum: EntityStatus,
    example: EntityStatus.ACTIVE
  })
  status: EntityStatus;

  @ApiProperty({
    description: 'Fecha de registro de la tienda',
    example: '2024-01-15T10:30:00.000Z'
  })
  registeredAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00.000Z'
  })
  updatedAt: Date;
}
