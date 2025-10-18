import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';
import { EntityStatus } from '../enums/entity-status.enum';
import { PrismaTransaction } from './person.repository';

/**
 * Filtros de consulta para usuarios
 */
export interface UserQueryFilters {
  storeId?: string;
  role?: UserRole;
  status?: EntityStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'email';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Interfaz del repositorio para la entidad User
 */
export interface UserRepository {
  /**
   * Buscar un usuario por su ID
   * @param id - ID único del usuario
   * @param tx - Transacción opcional
   * @returns El usuario encontrado o null si no existe
   */
  findById(id: string, tx?: PrismaTransaction): Promise<User | null>;

  /**
   * Buscar un usuario por su email
   * @param email - Email del usuario
   * @param tx - Transacción opcional
   * @returns El usuario encontrado o null si no existe
   */
  findByEmail(email: string, tx?: PrismaTransaction): Promise<User | null>;

  /**
   * Buscar un usuario por store y email
   * @param storeId - ID de la tienda
   * @param email - Email del usuario
   * @param tx - Transacción opcional
   * @returns El usuario encontrado o null si no existe
   */
  findByStoreAndEmail(storeId: string, email: string, tx?: PrismaTransaction): Promise<User | null>;

  /**
   * Buscar un usuario por store y documento de persona
   * @param storeId - ID de la tienda
   * @param documentNumber - Número de documento de la persona
   * @param tx - Transacción opcional
   * @returns El usuario encontrado o null si no existe
   */
  findByStoreAndDocument(storeId: string, documentNumber: string, tx?: PrismaTransaction): Promise<User | null>;

  /**
   * Buscar múltiples usuarios con filtros opcionales
   * @param filters - Filtros de búsqueda
   * @param tx - Transacción opcional
   * @returns Lista de usuarios que coinciden con los filtros
   */
  findMany(filters?: UserQueryFilters, tx?: PrismaTransaction): Promise<User[]>;

  /**
   * Guardar un nuevo usuario
   * @param user - Entidad User a guardar
   * @param tx - Transacción opcional
   * @returns El usuario guardado
   */
  save(user: User, tx?: PrismaTransaction): Promise<User>;

  /**
   * Crear un nuevo usuario con transacción
   * @param user - Entidad User a crear
   * @param tx - Transacción opcional
   * @returns El usuario creado
   */
  createWithTransaction(user: User, tx?: PrismaTransaction): Promise<User>;

  /**
   * Actualizar un usuario existente
   * @param user - Entidad User actualizada
   * @param tx - Transacción opcional
   * @returns El usuario actualizado
   */
  update(user: User, tx?: PrismaTransaction): Promise<User>;

  /**
   * Eliminar un usuario por ID (soft delete)
   * @param id - ID del usuario a eliminar
   * @param tx - Transacción opcional
   */
  delete(id: string, tx?: PrismaTransaction): Promise<void>;

  /**
   * Verificar si un usuario existe
   * @param id - ID del usuario
   * @param tx - Transacción opcional
   * @returns true si existe, false si no
   */
  exists(id: string, tx?: PrismaTransaction): Promise<boolean>;

  /**
   * Contar usuarios que coinciden con los filtros
   * @param filters - Filtros de búsqueda
   * @param tx - Transacción opcional
   * @returns Número total de usuarios que coinciden
   */
  count(filters?: UserQueryFilters, tx?: PrismaTransaction): Promise<number>;
}
