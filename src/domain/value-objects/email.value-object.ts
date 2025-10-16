/**
 * Value Object para validación de emails
 */
export class Email {
  private readonly _value: string;

  constructor(email: string) {
    this.validateEmail(email);
    this._value = email.toLowerCase().trim();
  }

  get value(): string {
    return this._value;
  }

  private validateEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error('El email no puede estar vacío');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('El formato del email no es válido');
    }

    if (email.length > 254) {
      throw new Error('El email no puede tener más de 254 caracteres');
    }
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
