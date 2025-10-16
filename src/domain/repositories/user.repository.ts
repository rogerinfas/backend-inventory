import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';
import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Interfaz del repositorio de Usuarios
 */
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByStoreId(storeId: string): Promise<User[]>;
  findByPersonId(personId: string): Promise<User | null>;
  findMany(filters?: {
    storeId?: string;
    role?: UserRole;
    status?: EntityStatus;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<User[]>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: {
    storeId?: string;
    role?: UserRole;
    status?: EntityStatus;
    search?: string;
  }): Promise<number>;
}
