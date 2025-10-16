import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Entidad Store - Representa una tienda/empresa
 */
export class Store {
  private constructor(
    private readonly _id: string,
    private _businessName: string,
    private _ruc: string,
    private _legalName: string,
    private _address: string | null,
    private _phone: string | null,
    private _email: string | null,
    private _logoUrl: string | null,
    private _status: EntityStatus,
    private readonly _registeredAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    id: string,
    businessName: string,
    ruc: string,
    legalName: string,
    address?: string,
    phone?: string,
    email?: string,
    logoUrl?: string
  ): Store {
    Store.validateRUC(ruc);
    Store.validateEmail(email || null);
    const now = new Date();

    return new Store(
      id,
      businessName,
      ruc,
      legalName,
      address || null,
      phone || null,
      email || null,
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
    legalName: string,
    address: string | null,
    phone: string | null,
    email: string | null,
    logoUrl: string | null,
    status: EntityStatus,
    registeredAt: Date,
    updatedAt: Date
  ): Store {
    return new Store(
      id,
      businessName,
      ruc,
      legalName,
      address,
      phone,
      email,
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

  get legalName(): string {
    return this._legalName;
  }

  get address(): string | null {
    return this._address;
  }

  get phone(): string | null {
    return this._phone;
  }

  get email(): string | null {
    return this._email;
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
      throw new Error('La razón social no puede estar vacía');
    }
    this._businessName = businessName.trim();
    this._updatedAt = new Date();
  }

  updateRUC(ruc: string): void {
    Store.validateRUC(ruc);
    this._ruc = ruc;
    this._updatedAt = new Date();
  }

  updateLegalName(legalName: string): void {
    if (!legalName || legalName.trim().length === 0) {
      throw new Error('El nombre legal no puede estar vacío');
    }
    this._legalName = legalName.trim();
    this._updatedAt = new Date();
  }

  updateAddress(address: string | null): void {
    this._address = address?.trim() || null;
    this._updatedAt = new Date();
  }

  updatePhone(phone: string | null): void {
    this._phone = phone || null;
    this._updatedAt = new Date();
  }

  updateEmail(email: string | null): void {
    Store.validateEmail(email);
    this._email = email || null;
    this._updatedAt = new Date();
  }

  updateLogoUrl(logoUrl: string | null): void {
    this._logoUrl = logoUrl || null;
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

  private static validateRUC(ruc: string): void {
    if (!ruc || ruc.trim().length === 0) {
      throw new Error('El RUC no puede estar vacío');
    }

    const cleanRUC = ruc.replace(/\D/g, '');
    if (cleanRUC.length !== 11) {
      throw new Error('El RUC debe tener 11 dígitos');
    }

    // Validar algoritmo de verificación del RUC peruano
    const digits = cleanRUC.split('').map(Number);
    const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * multipliers[i];
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? remainder : 11 - remainder;
    
    if (checkDigit !== digits[10]) {
      throw new Error('El RUC no es válido');
    }
  }

  private static validateEmail(email: string | null): void {
    if (email && email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('El formato del email no es válido');
      }
    }
  }

  equals(other: Store): boolean {
    return this._id === other._id;
  }
}
