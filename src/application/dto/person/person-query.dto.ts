import { IsEnum, IsString, IsOptional, IsNumber, IsIn, Min, Max, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DocumentType } from '../../../domain/enums/document-type.enum';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class PersonQueryDto {
  @ApiPropertyOptional({ 
    description: 'Filtrar por tipo de documento', 
    enum: DocumentType,
    example: DocumentType.DNI 
  })
  @IsOptional()
  @IsEnum(DocumentType, { message: 'Tipo de documento no válido' })
  documentType?: DocumentType;

  @ApiPropertyOptional({ 
    description: 'Filtrar por estado de la persona', 
    enum: EntityStatus,
    example: EntityStatus.ACTIVE 
  })
  @IsOptional()
  @IsEnum(EntityStatus, { message: 'Estado no válido' })
  status?: EntityStatus;

  @ApiPropertyOptional({ 
    description: 'Buscar por nombre, documento o razón social', 
    example: 'Juan Pérez',
    maxLength: 100
  })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena' })
  @MaxLength(100, { message: 'El término de búsqueda no puede tener más de 100 caracteres' })
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Número de página (empezando desde 1)', 
    example: 1,
    minimum: 1,
    maximum: 1000
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La página debe ser un número' })
  @Min(1, { message: 'La página debe ser mayor a 0' })
  @Max(1000, { message: 'La página no puede ser mayor a 1000' })
  page?: number;

  @ApiPropertyOptional({ 
    description: 'Cantidad de elementos por página', 
    example: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(1, { message: 'El límite debe ser mayor a 0' })
  @Max(100, { message: 'El límite no puede ser mayor a 100' })
  limit?: number;

  @ApiPropertyOptional({ 
    description: 'Número de elementos a omitir (para paginación)', 
    example: 0,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El offset debe ser un número' })
  @Min(0, { message: 'El offset no puede ser negativo' })
  offset?: number;

  @ApiPropertyOptional({ 
    description: 'Campo por el cual ordenar', 
    example: 'createdAt',
    enum: ['id', 'names', 'documentNumber', 'status', 'createdAt', 'updatedAt']
  })
  @IsOptional()
  @IsString({ message: 'El campo de ordenamiento debe ser una cadena' })
  @IsIn(['id', 'names', 'documentNumber', 'status', 'createdAt', 'updatedAt'], {
    message: 'Campo de ordenamiento no válido'
  })
  sortBy?: string;

  @ApiPropertyOptional({ 
    description: 'Orden de clasificación', 
    example: 'desc',
    enum: ['asc', 'desc']
  })
  @IsOptional()
  @IsString({ message: 'El orden debe ser una cadena' })
  @IsIn(['asc', 'desc'], { message: 'El orden debe ser "asc" o "desc"' })
  sortOrder?: 'asc' | 'desc';
}
