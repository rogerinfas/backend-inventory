import { Injectable } from '@nestjs/common';
import { LoginUseCase, LoginUseCaseInput, LoginUseCaseOutput } from '../use-cases/auth/login.use-case';
import { ValidateTokenUseCase, ValidateTokenUseCaseInput, ValidateTokenUseCaseOutput } from '../use-cases/auth/validate-token.use-case';
import { LoginDto, AuthResponseDto } from '../dto/auth';

@Injectable()
export class AuthApplicationService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const input: LoginUseCaseInput = {
      credentials: {
        email: loginDto.email,
        password: loginDto.password,
      },
    };

    const result: LoginUseCaseOutput = await this.loginUseCase.execute(input);

    if (!result.success) {
      throw new Error(result.error || 'Error en el login');
    }

    return result.data!;
  }

  async validateToken(token: string): Promise<boolean> {
    const input: ValidateTokenUseCaseInput = { token };
    const result: ValidateTokenUseCaseOutput = await this.validateTokenUseCase.execute(input);

    if (!result.success) {
      return false;
    }

    return result.data?.isValid || false;
  }
}
