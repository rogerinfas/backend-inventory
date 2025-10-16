import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Entidad Supplier - Representa un proveedor
 */
export class Supplier {
  private constructor(
    private readonly _id: string,
    private readonly _storeId: string,
    private readonly _personId: string,
    private _status: EntityStatus,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    id: string,
    storeId: string,
    personId: string
  ): Supplier {
    const now = new Date();
    return new Supplier(
      id,
      storeId,
      personId,
      EntityStatus.ACTIVE,
      now,
      now
    );
  }

  static fromPersistence(
    id: string,
    storeId: string,
    personId: string,
    status: EntityStatus,
    createdAt: Date,
    updatedAt: Date
  ): Supplier {
    return new Supplier(
      id,
      storeId,
      personId,
      status,
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

  get status(): EntityStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de negocio
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

  equals(other: Supplier): boolean {
    return this._id === other._id;
  }
}
