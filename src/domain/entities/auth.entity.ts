import { EntityStatus } from '../enums/entity-status.enum';
import { UserRole } from '../enums/user-role.enum';

export interface AuthPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  storeId: string | null;
  iat?: number;
  exp?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    storeId: string | null;
    person: {
      id: string;
      names: string;
      documentNumber: string;
    };
  };
}

export interface TokenValidationResult {
  isValid: boolean;
  payload?: AuthPayload;
  error?: string;
}
