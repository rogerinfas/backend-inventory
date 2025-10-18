import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'ID de la tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'El ID de la tienda debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID de la tienda es requerido' })
  @IsUUID('4', { message: 'El ID de la tienda debe ser un UUID válido' })
  storeId: string;

  @ApiProperty({
    description: 'ID de la persona',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString({ message: 'El ID de la persona debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID de la persona es requerido' })
  @IsUUID('4', { message: 'El ID de la persona debe ser un UUID válido' })
  personId: string;
}
