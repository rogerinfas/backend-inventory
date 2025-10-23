import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthApplicationService } from '../../application/services/auth.service';
import { LoginDto, AuthResponseDto, MeResponseDto } from '../../application/dto/auth';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthApplicationService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token JWT'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Obtener perfil del usuario autenticado',
    description: 'Devuelve la información del usuario autenticado incluyendo datos de la persona asociada'
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario obtenido exitosamente',
    type: MeResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async me(@Request() req: any): Promise<MeResponseDto> {
    return this.authService.me(req.user.sub);
  }
}
