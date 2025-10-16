import { Email } from '../value-objects/email.value-object';
import { UserRole } from '../enums/user-role.enum';
import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Entidad User - Representa un usuario del sistema
 */
export class User {
  private constructor(
    private readonly _id: string,
    private readonly _storeId: string,
    private readonly _personId: string,
    private readonly _email: Email,
    private readonly _passwordHash: string,
    private _role: UserRole,
    private _status: EntityStatus,
    private _lastLoginAt: Date | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    id: string,
    storeId: string,
    personId: string,
    email: string,
    passwordHash: string,
    role: UserRole
  ): User {
    const emailValue = new Email(email);
    const now = new Date();

    return new User(
      id,
      storeId,
      personId,
      emailValue,
      passwordHash,
      role,
      EntityStatus.ACTIVE,
      null,
      now,
      now
    );
  }

  static fromPersistence(
    id: string,
    storeId: string,
    personId: string,
    email: string,
    passwordHash: string,
    role: UserRole,
    status: EntityStatus,
    lastLoginAt: Date | null,
    createdAt: Date,
    updatedAt: Date
  ): User {
    const emailValue = new Email(email);

    return new User(
      id,
      storeId,
      personId,
      emailValue,
      passwordHash,
      role,
      status,
      lastLoginAt,
      createdAt,
      updatedAt
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get storeId(): string {
    return this._storeId;
  }

  get personId(): string {
    return this._personId;
  }

  get email(): Email {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get role(): UserRole {
    return this._role;
  }

  get status(): EntityStatus {
    return this._status;
  }

  get lastLoginAt(): Date | null {
    return this._lastLoginAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de negocio
  updateRole(role: UserRole): void {
    this._role = role;
    this._updatedAt = new Date();
  }

  updatePassword(passwordHash: string): void {
    if (!passwordHash || passwordHash.trim().length === 0) {
      throw new Error('El hash de la contraseña no puede estar vacío');
    }
    this._updatedAt = new Date();
  }

  recordLogin(): void {
    this._lastLoginAt = new Date();
    this._updatedAt = new Date();
  }

  activate(): void {
    this._status = EntityStatus.ACTIVE;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._status = EntityStatus.INACTIVE;
    this._updatedAt = new Date();
  }

  suspend(): void {
    this._status = EntityStatus.SUSPENDED;
    this._updatedAt = new Date();
  }

  delete(): void {
    this._status = EntityStatus.DELETED;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return this._status === EntityStatus.ACTIVE;
  }

  isDeleted(): boolean {
    return this._status === EntityStatus.DELETED;
  }

  hasRole(role: UserRole): boolean {
    return this._role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.includes(this._role);
  }

  canAccessAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN) || this.hasRole(UserRole.MANAGER);
  }

  canManageInventory(): boolean {
    return this.hasAnyRole([
      UserRole.ADMIN,
      UserRole.MANAGER,
      UserRole.WAREHOUSE
    ]);
  }

  canProcessSales(): boolean {
    return this.hasAnyRole([
      UserRole.ADMIN,
      UserRole.MANAGER,
      UserRole.SELLER,
      UserRole.CASHIER
    ]);
  }

  equals(other: User): boolean {
    return this._id === other._id;
  }
}
