import { ApiProperty } from '@nestjs/swagger';
import { PurchaseResponseDto } from './purchase-response.dto';

export class ListPurchasesResponseDto {
  @ApiProperty({
    description: 'Lista de compras',
    type: [PurchaseResponseDto]
  })
  data: PurchaseResponseDto[];

  @ApiProperty({
    description: 'Metadatos de paginación',
    example: {
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3
    }
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
