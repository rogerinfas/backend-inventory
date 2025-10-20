import { ApiProperty } from '@nestjs/swagger';
import { SunatConfigResponseDto } from './sunat-config-response.dto';

export class ListSunatConfigsResponseDto {
  @ApiProperty({
    description: 'Lista de configuraciones SUNAT',
    type: [SunatConfigResponseDto],
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        storeId: '123e4567-e89b-12d3-a456-426614174001',
        solUsername: 'usuario_sol_123',
        certificatePassword: 'cert_password_123',
        apiUrl: 'https://api.sunat.gob.pe/v1',
        environment: 'TEST',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T14:45:00.000Z'
      }
    ]
  })
  data: SunatConfigResponseDto[];

  @ApiProperty({
    description: 'Total de configuraciones SUNAT encontradas',
    example: 25,
    minimum: 0
  })
  total: number;

  @ApiProperty({
    description: 'Número de página actual',
    example: 1,
    minimum: 1
  })
  page: number;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas disponibles',
    example: 3,
    minimum: 0
  })
  totalPages: number;
}
