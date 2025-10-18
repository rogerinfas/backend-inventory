import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsNumber, IsOptional, Min, Max, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class StoreQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por estado de la tienda',
    enum: EntityStatus,
    example: EntityStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(EntityStatus, { message: 'El estado debe ser un valor válido' })
  status?: EntityStatus;

  @ApiPropertyOptional({
    description: 'Buscar por nombre comercial, razón social o RUC',
    example: 'Mi Tienda',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'El término de búsqueda no puede exceder 100 caracteres' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    maximum: 1000
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La página debe ser un número' })
  @Min(1, { message: 'La página debe ser al menos 1' })
  @Max(1000, { message: 'La página no puede exceder 1000' })
  page?: number;

  @ApiPropertyOptional({
    description: 'Elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(1, { message: 'El límite debe ser al menos 1' })
  @Max(100, { message: 'El límite no puede exceder 100' })
  limit?: number;

  @ApiPropertyOptional({
    description: 'Campo de ordenamiento',
    enum: ['businessName', 'legalName', 'registeredAt', 'updatedAt'],
    example: 'businessName'
  })
  @IsOptional()
  @IsString()
  sortBy?: 'businessName' | 'legalName' | 'registeredAt' | 'updatedAt';

  @ApiPropertyOptional({
    description: 'Orden de clasificación',
    enum: ['asc', 'desc'],
    example: 'asc'
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
