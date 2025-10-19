import { VoucherType } from '../enums/voucher-type.enum';

/**
 * Entidad VoucherSeries - Representa una serie de comprobantes
 */
export class VoucherSeries {
  private constructor(
    private readonly _id: string,
    private readonly _storeId: string,
    private _voucherType: VoucherType,
    private _series: string,
    private _currentNumber: number,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    id: string,
    storeId: string,
    voucherType: VoucherType,
    series: string,
    currentNumber: number = 1
  ): VoucherSeries {
    const now = new Date();

    return new VoucherSeries(
      id,
      storeId,
      voucherType,
      series,
      currentNumber,
      now,
      now
    );
  }

  static fromPersistence(
    id: string,
    storeId: string,
    voucherType: VoucherType,
    series: string,
    currentNumber: number,
    createdAt: Date,
    updatedAt: Date
  ): VoucherSeries {
    return new VoucherSeries(
      id,
      storeId,
      voucherType,
      series,
      currentNumber,
      createdAt,
      updatedAt
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get storeId(): string {
    return this._storeId;
  }

  get voucherType(): VoucherType {
    return this._voucherType;
  }

  get series(): string {
    return this._series;
  }

  get currentNumber(): number {
    return this._currentNumber;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de negocio
  updateVoucherType(voucherType: VoucherType): void {
    this._voucherType = voucherType;
    this._updatedAt = new Date();
  }

  updateSeries(series: string): void {
    if (!series || series.trim().length === 0) {
      throw new Error('La serie no puede estar vacía');
    }
    this._series = series.trim();
    this._updatedAt = new Date();
  }

  updateCurrentNumber(currentNumber: number): void {
    if (currentNumber < 1) {
      throw new Error('El número actual debe ser mayor a 0');
    }
    this._currentNumber = currentNumber;
    this._updatedAt = new Date();
  }

  incrementCurrentNumber(): void {
    this._currentNumber += 1;
    this._updatedAt = new Date();
  }

  resetCurrentNumber(): void {
    this._currentNumber = 1;
    this._updatedAt = new Date();
  }

  getNextNumber(): number {
    return this._currentNumber + 1;
  }

  getFormattedNumber(): string {
    return this._series + '-' + this._currentNumber.toString().padStart(8, '0');
  }

  getNextFormattedNumber(): string {
    return this._series + '-' + this.getNextNumber().toString().padStart(8, '0');
  }

  equals(other: VoucherSeries): boolean {
    return this._id === other._id;
  }

  isSameSeries(other: VoucherSeries): boolean {
    return this._storeId === other._storeId && 
           this._voucherType === other._voucherType && 
           this._series === other._series;
  }
}
