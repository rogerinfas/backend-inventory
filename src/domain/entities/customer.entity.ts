import { EntityStatus } from '../enums/entity-status.enum';

export class Customer {
  private constructor(
    private readonly _id: string,
    private readonly _storeId: string,
    private readonly _personId: string,
    private _status: EntityStatus,
    private readonly _registeredAt: Date,
    private _updatedAt: Date,
  ) {}

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

  // Factory methods
  static create(
    id: string,
    storeId: string,
    personId: string,
  ): Customer {
    if (!id || id.trim().length === 0) {
      throw new Error('El ID del cliente no puede estar vacío');
    }
    if (!storeId || storeId.trim().length === 0) {
      throw new Error('El ID de la tienda no puede estar vacío');
    }
    if (!personId || personId.trim().length === 0) {
      throw new Error('El ID de la persona no puede estar vacío');
    }

    const now = new Date();

    return new Customer(
      id.trim(),
      storeId.trim(),
      personId.trim(),
      EntityStatus.ACTIVE,
      now,
      now,
    );
  }

  static fromPersistence(
    id: string,
    storeId: string,
    personId: string,
    status: EntityStatus,
    registeredAt: Date,
    updatedAt: Date,
  ): Customer {
    return new Customer(
      id,
      storeId,
      personId,
      status,
      registeredAt,
      updatedAt,
    );
  }

  // Business methods
  activate(): void {
    if (this._status === EntityStatus.DELETED) {
      throw new Error('No se puede activar un cliente eliminado');
    }
    this._status = EntityStatus.ACTIVE;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    if (this._status === EntityStatus.DELETED) {
      throw new Error('No se puede desactivar un cliente eliminado');
    }
    this._status = EntityStatus.INACTIVE;
    this._updatedAt = new Date();
  }

  suspend(): void {
    if (this._status === EntityStatus.DELETED) {
      throw new Error('No se puede suspender un cliente eliminado');
    }
    this._status = EntityStatus.SUSPENDED;
    this._updatedAt = new Date();
  }

  delete(): void {
    this._status = EntityStatus.DELETED;
    this._updatedAt = new Date();
  }

  // Status checks
  isActive(): boolean {
    return this._status === EntityStatus.ACTIVE;
  }

  isInactive(): boolean {
    return this._status === EntityStatus.INACTIVE;
  }

  isSuspended(): boolean {
    return this._status === EntityStatus.SUSPENDED;
  }

  isDeleted(): boolean {
    return this._status === EntityStatus.DELETED;
  }

  // Validation methods
  canBeModified(): boolean {
    return this._status !== EntityStatus.DELETED;
  }

  canMakePurchases(): boolean {
    return this._status === EntityStatus.ACTIVE;
  }
}
