import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class ChangeUserStatusDto {
  @IsEnum(EntityStatus, { message: 'El estado debe ser ACTIVE, INACTIVE, SUSPENDED o DELETED' })
  @ApiProperty({ 
    enum: EntityStatus, 
    description: 'Nuevo estado del usuario',
    example: EntityStatus.INACTIVE
  })
  status: EntityStatus;
}
