import { ApiProperty } from '@nestjs/swagger';

export class AdminStatsResponseDto {
  @ApiProperty({
    description: 'Cantidad de productos disponibles en stock',
    example: 125
  })
  availableProducts: number;

  @ApiProperty({
    description: 'Cantidad de clientes activos registrados en la tienda',
    example: 42
  })
  activeCustomers: number;

  @ApiProperty({
    description: 'Cantidad de ventas del mes actual',
    example: 87
  })
  salesThisMonth: number;

  @ApiProperty({
    description: 'Ingresos totales del mes en soles',
    example: 15420.75
  })
  monthlyRevenue: number;

  @ApiProperty({
    description: 'ID de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  storeId: string;

  @ApiProperty({
    description: 'Nombre de la tienda',
    example: 'Tienda de Prueba'
  })
  storeName: string;
}

