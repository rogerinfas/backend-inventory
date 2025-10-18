import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class ListUsersResponseDto {
  @ApiProperty({ 
    type: [UserResponseDto], 
    description: 'Lista de usuarios' 
  })
  data: UserResponseDto[];

  @ApiProperty({ description: 'Total de usuarios' })
  total: number;

  @ApiProperty({ description: 'Página actual' })
  page: number;

  @ApiProperty({ description: 'Elementos por página' })
  limit: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages: number;
}
