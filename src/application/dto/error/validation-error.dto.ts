import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDto {
  @ApiProperty({ 
    description: 'Código de error de validación', 
    example: 'VALIDATION_ERROR' 
  })
  code: string;

  @ApiProperty({ 
    description: 'Mensaje de error', 
    example: 'Datos de entrada inválidos' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Código de estado HTTP', 
    example: 400 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Timestamp del error', 
    example: '2024-01-15T10:30:00.000Z' 
  })
  timestamp: string;

  @ApiProperty({ 
    description: 'Ruta donde ocurrió el error', 
    example: '/persons' 
  })
  path: string;

  @ApiProperty({ 
    description: 'Lista de errores de validación', 
    type: [String],
    example: ['El nombre es requerido', 'El email debe ser válido'] 
  })
  errors: string[];
}
