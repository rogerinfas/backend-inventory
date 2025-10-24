import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { SunatEnvironment } from '../../../domain/enums/sunat-environment.enum';

export class SunatConfigQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({ 
    description: 'Filtrar configuraciones por ID de tienda específica',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid'
  })
  storeId?: string;

  @IsOptional()
  @IsEnum(SunatEnvironment)
  @ApiPropertyOptional({ 
    enum: SunatEnvironment, 
    description: 'Filtrar configuraciones por ambiente de SUNAT',
    example: SunatEnvironment.TEST,
    enumName: 'SunatEnvironment'
  })
  environment?: SunatEnvironment;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Buscar por texto en nombre de usuario SOL o descripción',
    example: 'usuario'
  })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ 
    description: 'Número de página para paginación (empezando desde 1)',
    example: 1,
    minimum: 1, 
    maximum: 1000,
    default: 1
  })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ 
    description: 'Cantidad de elementos por página',
    example: 10,
    minimum: 1, 
    maximum: 100,
    default: 10
  })
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ 
    description: 'Campo por el cual ordenar los resultados',
    example: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'solUsername'],
    default: 'createdAt'
  })
  sortBy?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ 
    description: 'Dirección del ordenamiento',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'desc'
  })
  sortOrder?: 'asc' | 'desc';
}
