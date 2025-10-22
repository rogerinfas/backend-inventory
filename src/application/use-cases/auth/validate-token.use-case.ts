import { Injectable, Inject } from '@nestjs/common';
import { AuthService } from '../../../domain/services/auth.service';
import { TokenValidationResult } from '../../../domain/entities/auth.entity';

export interface ValidateTokenUseCaseInput {
  token: string;
}

export interface ValidateTokenUseCaseOutput {
  success: boolean;
  data?: TokenValidationResult;
  error?: string;
}

@Injectable()
export class ValidateTokenUseCase {
  constructor(@Inject('AuthService') private readonly authService: AuthService) {}

  async execute(input: ValidateTokenUseCaseInput): Promise<ValidateTokenUseCaseOutput> {
    try {
      const { token } = input;

      if (!token) {
        return {
          success: false,
          error: 'Token no proporcionado',
        };
      }

      const validationResult = this.authService.validateToken(token);

      return {
        success: true,
        data: validationResult,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al validar token',
      };
    }
  }
}
