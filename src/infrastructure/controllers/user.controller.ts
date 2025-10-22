import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  HttpCode,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
import { UserService } from '../../application/services/user.service';
import {
  CreateUserDto,
  CreateUserWithPersonDto,
  UpdateUserDto,
  UserResponseDto,
  UserWithPersonResponseDto,
  UserQueryDto,
  ChangeUserStatusDto,
  ListUsersResponseDto,
} from '../../application/dto/user';
import type { ListUsersResult } from '../../application/use-cases/user';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear usuario',
    description: 'Crea un nuevo usuario asociado a una persona existente. El rol se asigna automáticamente como SELLER por seguridad. Requiere autenticación JWT.'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token de acceso requerido o inválido' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Usuario ya existe' 
  })
  async createUser(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(dto);
  }

  @Post('with-person')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear usuario con persona asociada',
    description: 'Crea un nuevo usuario junto con su persona asociada en una sola operación atómica. El rol se asigna automáticamente como SELLER por seguridad. Requiere autenticación JWT.'
  })
  @ApiBody({ type: CreateUserWithPersonDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario y persona creados exitosamente',
    type: UserWithPersonResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token de acceso requerido o inválido' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Tienda no encontrada' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Usuario o persona ya existe' 
  })
  async createUserWithPerson(@Body() dto: CreateUserWithPersonDto): Promise<UserWithPersonResponseDto> {
    return this.userService.createUserWithPerson(dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar usuarios',
    description: 'Obtiene una lista paginada de usuarios con filtros opcionales. Requiere autenticación JWT.'
  })
  @ApiQuery({ name: 'storeId', required: false, description: 'ID de la tienda' })
  @ApiQuery({ name: 'role', required: false, description: 'Rol del usuario' })
  @ApiQuery({ name: 'status', required: false, description: 'Estado del usuario' })
  @ApiQuery({ name: 'search', required: false, description: 'Término de búsqueda' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el cual ordenar' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden de clasificación' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios obtenida exitosamente',
    type: ListUsersResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token de acceso requerido o inválido' 
  })
  async listUsers(@Query() query: UserQueryDto): Promise<ListUsersResult> {
    return this.userService.listUsers(query);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener usuario por ID',
    description: 'Obtiene un usuario específico por su ID. Requiere autenticación JWT.'
  })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario obtenido exitosamente',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token de acceso requerido o inválido' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar usuario',
    description: 'Actualiza un usuario existente. Requiere autenticación JWT.'
  })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario actualizado exitosamente',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token de acceso requerido o inválido' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email ya en uso' 
  })
  @ApiResponse({ 
    status: 410, 
    description: 'Usuario eliminado' 
  })
  async updateUser(
    @Param('id') id: string, 
    @Body() dto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ 
    summary: 'Cambiar estado del usuario',
    description: 'Cambia el estado de un usuario (ACTIVE, INACTIVE, SUSPENDED, DELETED). Requiere autenticación JWT.'
  })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiBody({ type: ChangeUserStatusDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado del usuario actualizado exitosamente',
    type: UserResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token de acceso requerido o inválido' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  @ApiResponse({ 
    status: 410, 
    description: 'Usuario eliminado' 
  })
  async changeUserStatus(
    @Param('id') id: string, 
    @Body() dto: ChangeUserStatusDto
  ): Promise<UserResponseDto> {
    return this.userService.changeUserStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario (soft delete). Requiere autenticación JWT.'
  })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiResponse({ 
    status: 204, 
    description: 'Usuario eliminado exitosamente' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token de acceso requerido o inválido' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  @ApiResponse({ 
    status: 410, 
    description: 'Usuario ya eliminado' 
  })
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
