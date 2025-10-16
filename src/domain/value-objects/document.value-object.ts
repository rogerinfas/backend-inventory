import { DocumentType } from '../enums/document-type.enum';

/**
 * Value Object para validación de documentos de identidad
 */
export class Document {
  private readonly _type: DocumentType;
  private readonly _number: string;

  constructor(type: DocumentType, number: string) {
    this.validateDocument(type, number);
    this._type = type;
    this._number = number;
  }

  get type(): DocumentType {
    return this._type;
  }

  get number(): string {
    return this._number;
  }

  private validateDocument(type: DocumentType, number: string): void {
    if (!number || number.trim().length === 0) {
      throw new Error('El número de documento no puede estar vacío');
    }

    const cleanNumber = number.replace(/\D/g, '');

    switch (type) {
      case DocumentType.DNI:
        if (cleanNumber.length !== 8) {
          throw new Error('El DNI debe tener 8 dígitos');
        }
        break;
      case DocumentType.RUC:
        if (cleanNumber.length !== 11) {
          throw new Error('El RUC debe tener 11 dígitos');
        }
        break;
      case DocumentType.CE:
        if (cleanNumber.length < 7 || cleanNumber.length > 9) {
          throw new Error('El CE debe tener entre 7 y 9 caracteres');
        }
        break;
      case DocumentType.PASSPORT:
        if (cleanNumber.length < 6 || cleanNumber.length > 12) {
          throw new Error('El pasaporte debe tener entre 6 y 12 caracteres');
        }
        break;
      default:
        throw new Error('Tipo de documento no válido');
    }
  }

  equals(other: Document): boolean {
    return this._type === other._type && this._number === other._number;
  }

  toString(): string {
    return `${this._type}: ${this._number}`;
  }
}
