import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, MinLength, MaxLength, IsUUID } from 'class-validator';
import { SunatEnvironment } from '../../../domain/enums/sunat-environment.enum';

export class CreateSunatConfigDto {
  @IsUUID()
  @ApiProperty({ 
    description: 'ID único de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  storeId: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ 
    description: 'Nombre de usuario SOL (Sistema de Operaciones en Línea)',
    example: 'usuario_sol_123',
    minLength: 3, 
    maxLength: 50 
  })
  solUsername: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @ApiProperty({ 
    description: 'Contraseña del usuario SOL (TODO: hashear en un futuro)',
    example: 'mi_password_seguro_123',
    minLength: 6, 
    maxLength: 100 
  })
  solPassword: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({ 
    description: 'Contraseña del certificado digital (opcional)',
    example: 'cert_password_123',
    maxLength: 100 
  })
  certificatePassword?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ 
    description: 'URL de la API de SUNAT (opcional)',
    example: 'https://api.sunat.gob.pe/v1',
    maxLength: 500 
  })
  apiUrl?: string;

  @IsOptional()
  @IsEnum(SunatEnvironment)
  @ApiPropertyOptional({ 
    enum: SunatEnvironment, 
    description: 'Ambiente de SUNAT donde se realizarán las operaciones',
    example: SunatEnvironment.TEST,
    default: SunatEnvironment.TEST,
    enumName: 'SunatEnvironment'
  })
  environment?: SunatEnvironment;
}
