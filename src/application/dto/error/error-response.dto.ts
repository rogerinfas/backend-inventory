import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ 
    description: 'Código de error único', 
    example: 'PERSON_NOT_FOUND' 
  })
  code: string;

  @ApiProperty({ 
    description: 'Mensaje de error descriptivo', 
    example: 'Persona con ID 123 no encontrada' 
  })
  message: string;

  @ApiProperty({ 
    description: 'Código de estado HTTP', 
    example: 404 
  })
  statusCode: number;

  @ApiProperty({ 
    description: 'Timestamp del error', 
    example: '2024-01-15T10:30:00.000Z' 
  })
  timestamp: string;

  @ApiProperty({ 
    description: 'Ruta donde ocurrió el error', 
    example: '/persons/123' 
  })
  path: string;

  @ApiProperty({ 
    description: 'Indica si el error es operacional', 
    example: true 
  })
  isOperational: boolean;

  @ApiPropertyOptional({ 
    description: 'Detalles adicionales del error', 
    example: { field: 'id', value: '123' } 
  })
  details?: Record<string, any>;
}
