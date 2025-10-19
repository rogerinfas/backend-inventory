import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Entidad Category - Representa una categoría de productos
 */
export class Category {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _description: string | null,
    private _status: EntityStatus,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    id: string,
    name: string,
    description?: string
  ): Category {
    const now = new Date();

    return new Category(
      id,
      name,
      description || null,
      EntityStatus.ACTIVE,
      now,
      now
    );
  }

  static fromPersistence(
    id: string,
    name: string,
    description: string | null,
    status: EntityStatus,
    createdAt: Date,
    updatedAt: Date
  ): Category {
    return new Category(
      id,
      name,
      description,
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

  get description(): string | null {
    return this._description;
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
      throw new Error('El nombre de la categoría no puede estar vacío');
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  updateDescription(description: string | null): void {
    this._description = description?.trim() || null;
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

  equals(other: Category): boolean {
    return this._id === other._id;
  }
}
