import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SunatEnvironment } from '../../../domain/enums/sunat-environment.enum';

export class SunatConfigResponseDto {
  @ApiProperty({ 
    description: 'ID único de la configuración SUNAT',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  id: string;

  @ApiProperty({ 
    description: 'ID único de la tienda asociada',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid'
  })
  storeId: string;

  @ApiProperty({ 
    description: 'Nombre de usuario SOL (Sistema de Operaciones en Línea)',
    example: 'usuario_sol_123'
  })
  solUsername: string;

  @ApiPropertyOptional({ 
    description: 'Contraseña del certificado digital',
    example: 'cert_password_123'
  })
  certificatePassword?: string;

  @ApiPropertyOptional({ 
    description: 'URL de la API de SUNAT',
    example: 'https://api.sunat.gob.pe/v1'
  })
  apiUrl?: string;

  @ApiProperty({ 
    enum: SunatEnvironment, 
    description: 'Ambiente de SUNAT donde se realizan las operaciones',
    example: SunatEnvironment.TEST,
    enumName: 'SunatEnvironment'
  })
  environment: SunatEnvironment;

  @ApiProperty({ 
    description: 'Fecha y hora de creación de la configuración',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time'
  })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Fecha y hora de la última actualización',
    example: '2024-01-15T14:45:00.000Z',
    format: 'date-time'
  })
  updatedAt: Date;
}
