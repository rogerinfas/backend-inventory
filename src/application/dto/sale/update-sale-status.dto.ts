import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SaleStatus } from '../../../domain/enums/sale-status.enum';

export class UpdateSaleStatusDto {
  @IsEnum(SaleStatus)
  @ApiProperty({
    description: 'Nuevo estado de la venta',
    enum: SaleStatus,
    example: SaleStatus.COMPLETED,
  })
  status: SaleStatus;
}
