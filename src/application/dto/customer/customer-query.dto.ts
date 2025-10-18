import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsNumber, IsOptional, Min, Max, MaxLength, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class CustomerQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por ID de tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString({ message: 'El ID de la tienda debe ser una cadena de texto' })
  @IsUUID('4', { message: 'El ID de la tienda debe ser un UUID válido' })
  storeId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de persona',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsString({ message: 'El ID de la persona debe ser una cadena de texto' })
  @IsUUID('4', { message: 'El ID de la persona debe ser un UUID válido' })
  personId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado del cliente',
    enum: EntityStatus,
    example: EntityStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(EntityStatus, { message: 'El estado debe ser ACTIVE, INACTIVE, SUSPENDED o DELETED' })
  status?: EntityStatus;

  @ApiPropertyOptional({
    description: 'Término de búsqueda',
    example: 'Juan',
  })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El término de búsqueda no puede exceder 100 caracteres' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    maximum: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La página debe ser un número' })
  @Min(1, { message: 'La página debe ser mayor a 0' })
  @Max(1000, { message: 'La página no puede ser mayor a 1000' })
  page?: number;

  @ApiPropertyOptional({
    description: 'Límite de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(1, { message: 'El límite debe ser mayor a 0' })
  @Max(100, { message: 'El límite no puede ser mayor a 100' })
  limit?: number;

  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar',
    example: 'registeredAt',
    enum: ['id', 'storeId', 'personId', 'status', 'registeredAt', 'updatedAt'],
  })
  @IsOptional()
  @IsString({ message: 'El campo de ordenamiento debe ser una cadena de texto' })
  @IsEnum(['id', 'storeId', 'personId', 'status', 'registeredAt', 'updatedAt'], {
    message: 'El campo de ordenamiento debe ser id, storeId, personId, status, registeredAt o updatedAt',
  })
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Dirección del ordenamiento',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString({ message: 'La dirección de ordenamiento debe ser una cadena de texto' })
  @IsEnum(['asc', 'desc'], { message: 'La dirección de ordenamiento debe ser asc o desc' })
  sortOrder?: 'asc' | 'desc';
}
