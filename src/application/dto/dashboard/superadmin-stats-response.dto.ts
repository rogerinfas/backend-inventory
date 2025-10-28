import { ApiProperty } from '@nestjs/swagger';

export class SuperadminStatsResponseDto {
  @ApiProperty({
    description: 'Total de usuarios en el sistema',
    example: 156
  })
  totalUsers: number;

  @ApiProperty({
    description: 'Total de tiendas activas',
    example: 12
  })
  activeStores: number;

  @ApiProperty({
    description: 'Ingresos totales de todas las tiendas en soles',
    example: 285420.50
  })
  totalRevenue: number;

  @ApiProperty({
    description: 'Total de transacciones del mes actual',
    example: 1247
  })
  transactionsThisMonth: number;
}

