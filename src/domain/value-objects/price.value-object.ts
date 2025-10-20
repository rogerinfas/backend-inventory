/// Value Object para precios monetarios
export class Price {
  private readonly _value: number;

  constructor(price: number) {
    this.validatePrice(price);
    this._value = Math.round(price * 100) / 100; // Redondear a 2 decimales
  }

  get value(): number {
    return this._value;
  }

  private validatePrice(price: number): void {
    if (typeof price !== 'number' || isNaN(price)) {
      throw new Error('El precio debe ser un número válido');
    }

    if (price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    if (price > 999999.99) {
      throw new Error('El precio no puede exceder 999,999.99');
    }

    // Validar que no tenga más de 2 decimales
    const decimalPlaces = (price.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) {
      throw new Error('El precio no puede tener más de 2 decimales');
    }
  }

  equals(other: Price): boolean {
    return this._value === other._value;
  }

  add(other: Price): Price {
    return new Price(this._value + other._value);
  }

  subtract(other: Price): Price {
    return new Price(this._value - other._value);
  }

  multiply(factor: number): Price {
    return new Price(this._value * factor);
  }

  toString(): string {
    return this._value.toFixed(2);
  }
}
