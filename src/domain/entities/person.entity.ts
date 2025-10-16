import { Document } from '../value-objects/document.value-object';
import { Email } from '../value-objects/email.value-object';
import { Phone } from '../value-objects/phone.value-object';
import { DocumentType } from '../enums/document-type.enum';
import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Entidad Person - Representa a una persona física o jurídica
 */
export class Person {
  private constructor(
    private readonly _id: string,
    private readonly _document: Document,
    private _names: string,
    private _legalName: string | null,
    private _address: string | null,
    private _phone: Phone | null,
    private _email: Email | null,
    private _status: EntityStatus,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    id: string,
    documentType: DocumentType,
    documentNumber: string,
    names: string,
    legalName?: string,
    address?: string,
    phone?: string,
    email?: string
  ): Person {
    const document = new Document(documentType, documentNumber);
    const phoneValue = phone ? new Phone(phone) : null;
    const emailValue = email ? new Email(email) : null;
    const now = new Date();

    return new Person(
      id,
      document,
      names,
      legalName || null,
      address || null,
      phoneValue,
      emailValue,
      EntityStatus.ACTIVE,
      now,
      now
    );
  }

  static fromPersistence(
    id: string,
    documentType: DocumentType,
    documentNumber: string,
    names: string,
    legalName: string | null,
    address: string | null,
    phone: string | null,
    email: string | null,
    status: EntityStatus,
    createdAt: Date,
    updatedAt: Date
  ): Person {
    const document = new Document(documentType, documentNumber);
    const phoneValue = phone ? new Phone(phone) : null;
    const emailValue = email ? new Email(email) : null;

    return new Person(
      id,
      document,
      names,
      legalName,
      address,
      phoneValue,
      emailValue,
      status,
      createdAt,
      updatedAt
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get document(): Document {
    return this._document;
  }

  get names(): string {
    return this._names;
  }

  get legalName(): string | null {
    return this._legalName;
  }

  get address(): string | null {
    return this._address;
  }

  get phone(): Phone | null {
    return this._phone;
  }

  get email(): Email | null {
    return this._email;
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
  updateNames(names: string): void {
    if (!names || names.trim().length === 0) {
      throw new Error('Los nombres no pueden estar vacíos');
    }
    this._names = names.trim();
    this._updatedAt = new Date();
  }

  updateLegalName(legalName: string | null): void {
    this._legalName = legalName?.trim() || null;
    this._updatedAt = new Date();
  }

  updateAddress(address: string | null): void {
    this._address = address?.trim() || null;
    this._updatedAt = new Date();
  }

  updatePhone(phone: string | null): void {
    this._phone = phone ? new Phone(phone) : null;
    this._updatedAt = new Date();
  }

  updateEmail(email: string | null): void {
    this._email = email ? new Email(email) : null;
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

  equals(other: Person): boolean {
    return this._id === other._id;
  }
}
