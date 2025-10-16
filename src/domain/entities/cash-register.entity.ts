import { Money } from '../value-objects/money.value-object';
import { CashRegisterStatus } from '../enums/cash-register-status.enum';

/**
 * Entidad CashRegister - Representa una caja registradora
 */
export class CashRegister {
  private constructor(
    private readonly _id: string,
    private readonly _storeId: string,
    private readonly _userId: string,
    private readonly _openedAt: Date,
    private _closedAt: Date | null,
    private readonly _initialAmount: Money,
    private _salesAmount: Money,
    private _finalAmount: Money | null,
    private _difference: Money | null,
    private _status: CashRegisterStatus,
    private _observations: string | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static open(
    id: string,
    storeId: string,
    userId: string,
    initialAmount: number
  ): CashRegister {
    if (initialAmount < 0) {
      throw new Error('El monto inicial no puede ser negativo');
    }

    const now = new Date();
    const initialAmountValue = new Money(initialAmount);
    const salesAmountValue = new Money(0);

    return new CashRegister(
      id,
      storeId,
      userId,
      now,
      null,
      initialAmountValue,
      salesAmountValue,
      null,
      null,
      CashRegisterStatus.OPEN,
      null,
      now,
      now
    );
  }

  static fromPersistence(
    id: string,
    storeId: string,
    userId: string,
    openedAt: Date,
    closedAt: Date | null,
    initialAmount: number,
    salesAmount: number,
    finalAmount: number | null,
    difference: number | null,
    status: CashRegisterStatus,
    observations: string | null,
    createdAt: Date,
    updatedAt: Date
  ): CashRegister {
    const initialAmountValue = new Money(initialAmount);
    const salesAmountValue = new Money(salesAmount);
    const finalAmountValue = finalAmount ? new Money(finalAmount) : null;
    const differenceValue = difference ? new Money(difference) : null;

    return new CashRegister(
      id,
      storeId,
      userId,
      openedAt,
      closedAt,
      initialAmountValue,
      salesAmountValue,
      finalAmountValue,
      differenceValue,
      status,
      observations,
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

  get userId(): string {
    return this._userId;
  }

  get openedAt(): Date {
    return this._openedAt;
  }

  get closedAt(): Date | null {
    return this._closedAt;
  }

  get initialAmount(): Money {
    return this._initialAmount;
  }

  get salesAmount(): Money {
    return this._salesAmount;
  }

  get finalAmount(): Money | null {
    return this._finalAmount;
  }

  get difference(): Money | null {
    return this._difference;
  }

  get status(): CashRegisterStatus {
    return this._status;
  }

  get observations(): string | null {
    return this._observations;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de negocio
  addSale(amount: number): void {
    if (this._status !== CashRegisterStatus.OPEN) {
      throw new Error('No se puede agregar una venta a una caja cerrada');
    }

    if (amount <= 0) {
      throw new Error('El monto de la venta debe ser mayor a cero');
    }

    const saleAmount = new Money(amount);
    this._salesAmount = this._salesAmount.add(saleAmount);
    this._updatedAt = new Date();
  }

  close(finalAmount: number, observations?: string): void {
    if (this._status !== CashRegisterStatus.OPEN) {
      throw new Error('La caja ya está cerrada');
    }

    if (finalAmount < 0) {
      throw new Error('El monto final no puede ser negativo');
    }

    const finalAmountValue = new Money(finalAmount);
    const expectedAmount = this._initialAmount.add(this._salesAmount);
    const differenceValue = finalAmountValue.subtract(expectedAmount);

    this._finalAmount = finalAmountValue;
    this._difference = differenceValue;
    this._closedAt = new Date();
    this._status = CashRegisterStatus.CLOSED;
    this._observations = observations || null;
    this._updatedAt = new Date();
  }

  lock(observations?: string): void {
    if (this._status !== CashRegisterStatus.OPEN) {
      throw new Error('Solo se puede bloquear una caja abierta');
    }

    this._status = CashRegisterStatus.LOCKED;
    this._observations = observations || null;
    this._updatedAt = new Date();
  }

  unlock(): void {
    if (this._status !== CashRegisterStatus.LOCKED) {
      throw new Error('Solo se puede desbloquear una caja bloqueada');
    }

    this._status = CashRegisterStatus.OPEN;
    this._observations = null;
    this._updatedAt = new Date();
  }

  isOpen(): boolean {
    return this._status === CashRegisterStatus.OPEN;
  }

  isClosed(): boolean {
    return this._status === CashRegisterStatus.CLOSED;
  }

  isLocked(): boolean {
    return this._status === CashRegisterStatus.LOCKED;
  }

  getExpectedAmount(): Money {
    return this._initialAmount.add(this._salesAmount);
  }

  hasDifference(): boolean {
    return this._difference !== null && this._difference.amount !== 0;
  }

  getTotalAmount(): Money {
    return this._initialAmount.add(this._salesAmount);
  }

  equals(other: CashRegister): boolean {
    return this._id === other._id;
  }
}
