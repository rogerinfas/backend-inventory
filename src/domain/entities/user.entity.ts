import { EntityStatus } from '../enums/entity-status.enum';
import { UserRole } from '../enums/user-role.enum';

/**
 * Entidad User - Representa un usuario del sistema
 */
export class User {
  private constructor(
    public readonly id: string,
    public readonly storeId: string | null, // Opcional para usuarios admin generales
    public readonly personId: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public readonly status: EntityStatus,
    public readonly lastLoginAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Factory method para crear una nueva instancia de User
   */
  static create(
    id: string,
    storeId: string | null,
    personId: string,
    email: string,
    passwordHash: string,
    role: UserRole,
  ): User {
    const now = new Date();
    return new User(
      id,
      storeId,
      personId,
      email,
      passwordHash,
      role,
      EntityStatus.ACTIVE,
      null, // lastLoginAt
      now,
      now,
    );
  }

  /**
   * Factory method para reconstruir User desde persistencia
   */
  static fromPersistence(
    id: string,
    storeId: string | null,
    personId: string,
    email: string,
    passwordHash: string,
    role: UserRole,
    status: EntityStatus,
    lastLoginAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(
      id,
      storeId,
      personId,
      email,
      passwordHash,
      role,
      status,
      lastLoginAt,
      createdAt,
      updatedAt,
    );
  }

  /**
   * Verifica si el usuario está activo
   */
  isActive(): boolean {
    return this.status === EntityStatus.ACTIVE;
  }

  /**
   * Verifica si el usuario está eliminado
   */
  isDeleted(): boolean {
    return this.status === EntityStatus.DELETED;
  }

  /**
   * Verifica si el usuario está suspendido
   */
  isSuspended(): boolean {
    return this.status === EntityStatus.SUSPENDED;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  /**
   * Verifica si el usuario es administrador general (sin tienda asociada)
   */
  isGeneralAdmin(): boolean {
    return this.role === UserRole.ADMIN && this.storeId === null;
  }

  /**
   * Verifica si el usuario está asociado a una tienda
   */
  hasStore(): boolean {
    return this.storeId !== null;
  }

  /**
   * Verifica si el usuario es super administrador
   */
  isSuperAdmin(): boolean {
    return this.role === UserRole.SUPERADMIN;
  }

  /**
   * Verifica si el usuario es administrador de tienda
   */
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * Verifica si el usuario puede vender
   */
  canSell(): boolean {
    return [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SELLER].includes(this.role);
  }

  /**
   * Verifica si el usuario puede gestionar inventario
   */
  canManageInventory(): boolean {
    return [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SELLER].includes(this.role);
  }

  /**
   * Verifica si el usuario puede gestionar usuarios
   */
  canManageUsers(): boolean {
    return [UserRole.SUPERADMIN, UserRole.ADMIN].includes(this.role);
  }

  /**
   * Verifica si el usuario puede gestionar tiendas (solo super admin)
   */
  canManageStores(): boolean {
    return this.role === UserRole.SUPERADMIN;
  }

  /**
   * Actualiza el último login
   */
  updateLastLogin(): User {
    return new User(
      this.id,
      this.storeId,
      this.personId,
      this.email,
      this.passwordHash,
      this.role,
      this.status,
      new Date(),
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Cambia el estado del usuario
   */
  changeStatus(newStatus: EntityStatus): User {
    return new User(
      this.id,
      this.storeId,
      this.personId,
      this.email,
      this.passwordHash,
      this.role,
      newStatus,
      this.lastLoginAt,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Cambia el rol del usuario
   */
  changeRole(newRole: UserRole): User {
    return new User(
      this.id,
      this.storeId,
      this.personId,
      this.email,
      this.passwordHash,
      newRole,
      this.status,
      this.lastLoginAt,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Actualiza la contraseña
   */
  updatePassword(newPasswordHash: string): User {
    return new User(
      this.id,
      this.storeId,
      this.personId,
      this.email,
      newPasswordHash,
      this.role,
      this.status,
      this.lastLoginAt,
      this.createdAt,
      new Date(),
    );
  }
}
