import { IsOptional, IsString, IsEnum, IsNumber, Min, Max, MaxLength, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class BrandQueryDto {
  @IsOptional()
  @IsEnum(EntityStatus)
  @ApiPropertyOptional({
    description: 'Filtrar por estado',
    enum: EntityStatus,
    example: EntityStatus.ACTIVE,
  })
  status?: EntityStatus;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'El término de búsqueda no puede exceder 100 caracteres' })
  @ApiPropertyOptional({
    description: 'Buscar por nombre',
    example: 'samsung',
    maxLength: 100,
  })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La página debe ser un número' })
  @Min(1, { message: 'La página debe ser mayor a 0' })
  @Max(1000, { message: 'La página no puede exceder 1000' })
  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    maximum: 1000,
  })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(1, { message: 'El límite debe ser mayor a 0' })
  @Max(100, { message: 'El límite no puede exceder 100' })
  @ApiPropertyOptional({
    description: 'Elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  limit?: number;

  @IsOptional()
  @IsString()
  @IsIn(['name', 'createdAt', 'updatedAt'], {
    message: 'El campo de ordenamiento debe ser: name, createdAt, updatedAt',
  })
  @ApiPropertyOptional({
    description: 'Campo de ordenamiento',
    example: 'name',
    enum: ['name', 'createdAt', 'updatedAt'],
  })
  sortBy?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], {
    message: 'El orden debe ser: asc, desc',
  })
  @ApiPropertyOptional({
    description: 'Orden de clasificación',
    example: 'asc',
    enum: ['asc', 'desc'],
  })
  sortOrder?: 'asc' | 'desc';
}
