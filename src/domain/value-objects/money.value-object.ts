/**
 * Value Object para manejo de montos monetarios
 */
export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  constructor(amount: number, currency: string = 'PEN') {
    this.validateAmount(amount);
    this.validateCurrency(currency);
    this._amount = Math.round(amount * 100) / 100; // Redondear a 2 decimales
    this._currency = currency;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  private validateAmount(amount: number): void {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('El monto debe ser un número válido');
    }

    if (amount < 0) {
      throw new Error('El monto no puede ser negativo');
    }

    if (amount > 999999999.99) {
      throw new Error('El monto excede el límite máximo permitido');
    }
  }

  private validateCurrency(currency: string): void {
    if (!currency || currency.length !== 3) {
      throw new Error('La moneda debe ser un código de 3 caracteres');
    }

    const validCurrencies = ['PEN', 'USD', 'EUR'];
    if (!validCurrencies.includes(currency.toUpperCase())) {
      throw new Error('Moneda no soportada');
    }
  }

  add(other: Money): Money {
    this.validateSameCurrency(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    this.validateSameCurrency(other);
    return new Money(this._amount - other._amount, this._currency);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('El factor de multiplicación no puede ser negativo');
    }
    return new Money(this._amount * factor, this._currency);
  }

  divide(divisor: number): Money {
    if (divisor <= 0) {
      throw new Error('El divisor debe ser mayor a cero');
    }
    return new Money(this._amount / divisor, this._currency);
  }

  private validateSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error('No se pueden operar montos con diferentes monedas');
    }
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  isGreaterThan(other: Money): boolean {
    this.validateSameCurrency(other);
    return this._amount > other._amount;
  }

  isLessThan(other: Money): boolean {
    this.validateSameCurrency(other);
    return this._amount < other._amount;
  }

  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }
}
