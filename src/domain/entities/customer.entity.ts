import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Entidad Customer - Representa un cliente
 */
export class Customer {
  private constructor(
    private readonly _id: string,
    private readonly _storeId: string,
    private readonly _personId: string,
    private _status: EntityStatus,
    private readonly _registeredAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    id: string,
    storeId: string,
    personId: string
  ): Customer {
    const now = new Date();
    return new Customer(
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
    registeredAt: Date,
    updatedAt: Date
  ): Customer {
    return new Customer(
      id,
      storeId,
      personId,
      status,
      registeredAt,
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

  get registeredAt(): Date {
    return this._registeredAt;
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

  equals(other: Customer): boolean {
    return this._id === other._id;
  }
}
