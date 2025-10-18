import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class UpdateCustomerDto {
  @ApiPropertyOptional({
    description: 'Nuevo estado del cliente',
    enum: EntityStatus,
    example: EntityStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(EntityStatus, { message: 'Estado inválido' })
  status?: EntityStatus;
}
