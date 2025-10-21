import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload, LoginCredentials, AuthResult, TokenValidationResult } from '../entities/auth.entity';
import { User } from '../entities/user.entity';

@Injectable()
export abstract class AuthService {
  abstract generateToken(payload: AuthPayload): string;
  abstract validateToken(token: string): TokenValidationResult;
  abstract hashPassword(password: string): Promise<string>;
  abstract comparePassword(password: string, hash: string): Promise<boolean>;
}
