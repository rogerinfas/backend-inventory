import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { SunatEnvironment } from '../../../domain/enums/sunat-environment.enum';

export class UpdateSunatConfigDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiPropertyOptional({ 
    description: 'Nombre de usuario SOL (Sistema de Operaciones en Línea)',
    example: 'usuario_sol_actualizado',
    minLength: 3, 
    maxLength: 50 
  })
  solUsername?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @ApiPropertyOptional({ 
    description: 'Contraseña del usuario SOL (TODO: hashear en un futuro)',
    example: 'nueva_password_segura_456',
    minLength: 6, 
    maxLength: 100 
  })
  solPassword?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({ 
    description: 'Contraseña del certificado digital',
    example: 'nueva_cert_password_789',
    maxLength: 100 
  })
  certificatePassword?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ 
    description: 'URL de la API de SUNAT',
    example: 'https://api.sunat.gob.pe/v2',
    maxLength: 500 
  })
  apiUrl?: string;

  @IsOptional()
  @IsEnum(SunatEnvironment)
  @ApiPropertyOptional({ 
    enum: SunatEnvironment, 
    description: 'Ambiente de SUNAT donde se realizarán las operaciones',
    example: SunatEnvironment.PRODUCTION,
    enumName: 'SunatEnvironment'
  })
  environment?: SunatEnvironment;
}
