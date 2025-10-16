/**
 * Value Object para validación de números de teléfono
 */
export class Phone {
  private readonly _value: string;

  constructor(phone: string) {
    this.validatePhone(phone);
    this._value = phone;
  }

  get value(): string {
    return this._value;
  }

  private validatePhone(phone: string): void {
    if (!phone || phone.trim().length === 0) {
      throw new Error('El teléfono no puede estar vacío');
    }

    // Remover espacios, guiones y paréntesis
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Validar que solo contenga números y el símbolo +
    if (!/^\+?[0-9]+$/.test(cleanPhone)) {
      throw new Error('El teléfono solo puede contener números y el símbolo +');
    }

    // Validar longitud (entre 7 y 15 dígitos, estándar internacional)
    const digitsOnly = cleanPhone.replace(/^\+/, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      throw new Error('El teléfono debe tener entre 7 y 15 dígitos');
    }
  }

  equals(other: Phone): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
