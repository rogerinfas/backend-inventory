/**
 * Value Object para validación de códigos SKU
 */
export class SKU {
  private readonly _value: string;

  constructor(sku: string) {
    this.validateSKU(sku);
    this._value = sku.toUpperCase().trim();
  }

  get value(): string {
    return this._value;
  }

  private validateSKU(sku: string): void {
    if (!sku || sku.trim().length === 0) {
      throw new Error('El SKU no puede estar vacío');
    }

    const cleanSKU = sku.trim();
    
    // Validar longitud (entre 3 y 50 caracteres)
    if (cleanSKU.length < 3 || cleanSKU.length > 50) {
      throw new Error('El SKU debe tener entre 3 y 50 caracteres');
    }

    // Validar formato: solo letras, números, guiones y guiones bajos
    if (!/^[A-Z0-9\-_]+$/.test(cleanSKU)) {
      throw new Error('El SKU solo puede contener letras, números, guiones y guiones bajos');
    }

    // No puede empezar o terminar con guión o guión bajo
    if (cleanSKU.startsWith('-') || cleanSKU.startsWith('_') || 
        cleanSKU.endsWith('-') || cleanSKU.endsWith('_')) {
      throw new Error('El SKU no puede empezar o terminar con guión o guión bajo');
    }
  }

  equals(other: SKU): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
