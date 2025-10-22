import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import type { AuthRepository } from '../../../domain/repositories/auth.repository';
import { AuthService } from '../../../domain/services/auth.service';
import { LoginCredentials, AuthResult } from '../../../domain/entities/auth.entity';
import { User } from '../../../domain/entities/user.entity';

export interface LoginUseCaseInput {
  credentials: LoginCredentials;
}

export interface LoginUseCaseOutput {
  success: boolean;
  data?: AuthResult;
  error?: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('AuthRepository') private readonly authRepository: AuthRepository,
    @Inject('AuthService') private readonly authService: AuthService,
  ) {}

  async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    try {
      const { email, password } = input.credentials;

      // Buscar usuario por email
      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        return {
          success: false,
          error: 'Credenciales inválidas',
        };
      }

      // Verificar si el usuario está activo
      if (user.status !== 'ACTIVE') {
        return {
          success: false,
          error: 'Usuario inactivo',
        };
      }

      // Validar contraseña
      const isPasswordValid = await this.authRepository.validatePassword(user, password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Credenciales inválidas',
        };
      }

      // Crear resultado de autenticación
      const authResult = await this.authRepository.createAuthResult(user);

      return {
        success: true,
        data: authResult,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error interno del servidor',
      };
    }
  }
}
