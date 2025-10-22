import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../domain/services/auth.service';
import { AuthPayload, TokenValidationResult, AuthResult } from '../../domain/entities/auth.entity';
import * as bcrypt from 'bcrypt';

interface UserWithRelations {
  id: string;
  email: string;
  role: any;
  storeId: string | null;
  person: {
    id: string;
    names: string;
    documentNumber: string;
  };
}

@Injectable()
export class AuthInfrastructureService extends AuthService {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  generateToken(payload: AuthPayload): string {
    return this.jwtService.sign(payload);
  }

  validateToken(token: string): TokenValidationResult {
    try {
      const payload = this.jwtService.verify(token) as AuthPayload;
      return {
        isValid: true,
        payload,
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Token inválido o expirado',
      };
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async createAuthResult(user: UserWithRelations): Promise<AuthResult> {
    const payload: AuthPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      storeId: user.storeId,
    };

    const accessToken = this.generateToken(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
        person: {
          id: user.person.id,
          names: user.person.names,
          documentNumber: user.person.documentNumber,
        },
      },
    };
  }
}
