import { LoginCredentials, AuthResult } from '../entities/auth.entity';

interface UserWithRelations {
  id: string;
  email: string;
  passwordHash: string;
  role: any;
  status: any;
  storeId: string;
  person: {
    id: string;
    names: string;
    documentNumber: string;
  };
}

export interface AuthRepository {
  findByEmail(email: string): Promise<UserWithRelations | null>;
  validatePassword(user: UserWithRelations, password: string): Promise<boolean>;
  createAuthResult(user: UserWithRelations): Promise<AuthResult>;
}
