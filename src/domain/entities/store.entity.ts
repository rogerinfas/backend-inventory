import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Entidad Store - Representa una tienda/empresa del sistema
 */
export class Store {
  private constructor(
    private readonly _id: string,
    private _businessName: string,
    private readonly _ruc: string,
    private _address: string | null,
    private _phone: string | null,
    private _logoUrl: string | null,
    private _status: EntityStatus,
    private readonly _registeredAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    id: string,
    businessName: string,
    ruc: string,
    address?: string,
    phone?: string,
    logoUrl?: string
  ): Store {
    const now = new Date();

    return new Store(
      id,
      businessName,
      ruc,
      address || null,
      phone || null,
      logoUrl || null,
      EntityStatus.ACTIVE,
      now,
      now
    );
  }

  static fromPersistence(
    id: string,
    businessName: string,
    ruc: string,
    address: string | null,
    phone: string | null,
    logoUrl: string | null,
    status: EntityStatus,
    registeredAt: Date,
    updatedAt: Date
  ): Store {
    return new Store(
      id,
      businessName,
      ruc,
      address,
      phone,
      logoUrl,
      status,
      registeredAt,
      updatedAt
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get businessName(): string {
    return this._businessName;
  }

  get ruc(): string {
    return this._ruc;
  }

  get address(): string | null {
    return this._address;
  }

  get phone(): string | null {
    return this._phone;
  }

  get logoUrl(): string | null {
    return this._logoUrl;
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
  updateBusinessName(businessName: string): void {
    if (!businessName || businessName.trim().length === 0) {
      throw new Error('El nombre comercial no puede estar vacío');
    }
    this._businessName = businessName.trim();
    this._updatedAt = new Date();
  }

  updateAddress(address: string | null): void {
    this._address = address?.trim() || null;
    this._updatedAt = new Date();
  }

  updatePhone(phone: string | null): void {
    this._phone = phone?.trim() || null;
    this._updatedAt = new Date();
  }

  updateLogoUrl(logoUrl: string | null): void {
    this._logoUrl = logoUrl?.trim() || null;
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

  equals(other: Store): boolean {
    return this._id === other._id;
  }

}
