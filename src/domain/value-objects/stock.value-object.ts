/// Value Object para cantidades de stock
export class Stock {
  private readonly _value: number;

  constructor(stock: number) {
    this.validateStock(stock);
    this._value = Math.floor(stock); // Solo números enteros
  }

  get value(): number {
    return this._value;
  }

  private validateStock(stock: number): void {
    if (typeof stock !== 'number' || isNaN(stock)) {
      throw new Error('El stock debe ser un número válido');
    }

    if (!Number.isInteger(stock)) {
      throw new Error('El stock debe ser un número entero');
    }

    if (stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    if (stock > 999999) {
      throw new Error('El stock no puede exceder 999,999 unidades');
    }
  }

  equals(other: Stock): boolean {
    return this._value === other._value;
  }

  add(other: Stock): Stock {
    return new Stock(this._value + other._value);
  }

  subtract(other: Stock): Stock {
    const result = this._value - other._value;
    if (result < 0) {
      throw new Error('No se puede restar más stock del disponible');
    }
    return new Stock(result);
  }

  isGreaterThan(other: Stock): boolean {
    return this._value > other._value;
  }

  isLessThan(other: Stock): boolean {
    return this._value < other._value;
  }

  isZero(): boolean {
    return this._value === 0;
  }

  toString(): string {
    return this._value.toString();
  }
}
