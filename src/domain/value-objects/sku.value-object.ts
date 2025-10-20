/// Value Object para SKU (Stock Keeping Unit)
export class Sku {
  private readonly _value: string;

  constructor(sku: string) {
    this.validateSku(sku);
    this._value = sku.toUpperCase().trim();
  }

  get value(): string {
    return this._value;
  }

  private validateSku(sku: string): void {
    if (!sku || typeof sku !== 'string') {
      throw new Error('SKU es requerido');
    }

    const trimmedSku = sku.trim();
    
    if (trimmedSku.length < 3) {
      throw new Error('SKU debe tener al menos 3 caracteres');
    }

    if (trimmedSku.length > 50) {
      throw new Error('SKU no puede exceder 50 caracteres');
    }

    // Validar que solo contenga letras, números, guiones y guiones bajos
    const skuRegex = /^[A-Za-z0-9\-_]+$/;
    if (!skuRegex.test(trimmedSku)) {
      throw new Error('SKU solo puede contener letras, números, guiones y guiones bajos');
    }
  }

  equals(other: Sku): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
