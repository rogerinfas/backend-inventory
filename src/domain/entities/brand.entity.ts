import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Entidad Brand - Representa una marca de productos
 */
export class Brand {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _status: EntityStatus,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    id: string,
    name: string
  ): Brand {
    const now = new Date();

    return new Brand(
      id,
      name,
      EntityStatus.ACTIVE,
      now,
      now
    );
  }

  static fromPersistence(
    id: string,
    name: string,
    status: EntityStatus,
    createdAt: Date,
    updatedAt: Date
  ): Brand {
    return new Brand(
      id,
      name,
      status,
      createdAt,
      updatedAt
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
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
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('El nombre de la marca no puede estar vacío');
    }
    this._name = name.trim();
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

  equals(other: Brand): boolean {
    return this._id === other._id;
  }
}
