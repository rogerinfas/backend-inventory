import { ApiProperty } from '@nestjs/swagger';
import { SaleResponseDto } from './sale-response.dto';

export class ListSalesResponseDto {
  @ApiProperty({
    description: 'Lista de ventas',
    type: [SaleResponseDto]
  })
  data: SaleResponseDto[];

  @ApiProperty({
    description: 'Metadatos de paginación',
    type: 'object',
    properties: {
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 10 },
      total: { type: 'number', example: 50 },
      totalPages: { type: 'number', example: 5 }
    }
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
