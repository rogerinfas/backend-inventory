import { Money } from '../value-objects/money.value-object';
import { VoucherType } from '../enums/voucher-type.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { SaleStatus } from '../enums/sale-status.enum';
import { SunatStatus } from '../enums/sunat-status.enum';

/**
 * Entidad Sale - Representa una venta
 */
export class Sale {
  private constructor(
    private readonly _id: string,
    private readonly _storeId: string,
    private readonly _customerId: string | null,
    private readonly _userId: string,
    private readonly _voucherType: VoucherType,
    private readonly _voucherSeries: string,
    private readonly _voucherNumber: string,
    private readonly _issuedAt: Date,
    private _subtotal: Money,
    private _tax: Money,
    private _discount: Money,
    private _total: Money,
    private readonly _paymentMethod: PaymentMethod,
    private _status: SaleStatus,
    private _sunatStatus: SunatStatus,
    private _sunatHash: string | null,
    private _sunatXml: string | null,
    private _notes: string | null,
    private readonly _registeredAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    id: string,
    storeId: string,
    userId: string,
    voucherType: VoucherType,
    voucherSeries: string,
    voucherNumber: string,
    issuedAt: Date,
    subtotal: number,
    tax: number = 0,
    discount: number = 0,
    paymentMethod: PaymentMethod,
    customerId?: string,
    notes?: string
  ): Sale {
    if (subtotal < 0) {
      throw new Error('El subtotal no puede ser negativo');
    }

    if (tax < 0) {
      throw new Error('El impuesto no puede ser negativo');
    }

    if (discount < 0) {
      throw new Error('El descuento no puede ser negativo');
    }

    if (discount > subtotal) {
      throw new Error('El descuento no puede ser mayor al subtotal');
    }

    const subtotalValue = new Money(subtotal);
    const taxValue = new Money(tax);
    const discountValue = new Money(discount);
    const total = subtotalValue.add(taxValue).subtract(discountValue);
    const now = new Date();

    return new Sale(
      id,
      storeId,
      customerId || null,
      userId,
      voucherType,
      voucherSeries,
      voucherNumber,
      issuedAt,
      subtotalValue,
      taxValue,
      discountValue,
      total,
      paymentMethod,
      SaleStatus.COMPLETED,
      SunatStatus.PENDING,
      null,
      null,
      notes || null,
      now,
      now
    );
  }

  static fromPersistence(
    id: string,
    storeId: string,
    customerId: string | null,
    userId: string,
    voucherType: VoucherType,
    voucherSeries: string,
    voucherNumber: string,
    issuedAt: Date,
    subtotal: number,
    tax: number,
    discount: number,
    total: number,
    paymentMethod: PaymentMethod,
    status: SaleStatus,
    sunatStatus: SunatStatus,
    sunatHash: string | null,
    sunatXml: string | null,
    notes: string | null,
    registeredAt: Date,
    updatedAt: Date
  ): Sale {
    const subtotalValue = new Money(subtotal);
    const taxValue = new Money(tax);
    const discountValue = new Money(discount);
    const totalValue = new Money(total);

    return new Sale(
      id,
      storeId,
      customerId,
      userId,
      voucherType,
      voucherSeries,
      voucherNumber,
      issuedAt,
      subtotalValue,
      taxValue,
      discountValue,
      totalValue,
      paymentMethod,
      status,
      sunatStatus,
      sunatHash,
      sunatXml,
      notes,
      registeredAt,
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

  get customerId(): string | null {
    return this._customerId;
  }

  get userId(): string {
    return this._userId;
  }

  get voucherType(): VoucherType {
    return this._voucherType;
  }

  get voucherSeries(): string {
    return this._voucherSeries;
  }

  get voucherNumber(): string {
    return this._voucherNumber;
  }

  get issuedAt(): Date {
    return this._issuedAt;
  }

  get subtotal(): Money {
    return this._subtotal;
  }

  get tax(): Money {
    return this._tax;
  }

  get discount(): Money {
    return this._discount;
  }

  get total(): Money {
    return this._total;
  }

  get paymentMethod(): PaymentMethod {
    return this._paymentMethod;
  }

  get status(): SaleStatus {
    return this._status;
  }

  get sunatStatus(): SunatStatus {
    return this._sunatStatus;
  }

  get sunatHash(): string | null {
    return this._sunatHash;
  }

  get sunatXml(): string | null {
    return this._sunatXml;
  }

  get notes(): string | null {
    return this._notes;
  }

  get registeredAt(): Date {
    return this._registeredAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de negocio
  updateNotes(notes: string | null): void {
    this._notes = notes?.trim() || null;
    this._updatedAt = new Date();
  }

  cancel(): void {
    if (this._status === SaleStatus.CANCELLED) {
      throw new Error('La venta ya está cancelada');
    }

    if (this._status === SaleStatus.REFUNDED) {
      throw new Error('No se puede cancelar una venta reembolsada');
    }

    this._status = SaleStatus.CANCELLED;
    this._updatedAt = new Date();
  }

  refund(): void {
    if (this._status === SaleStatus.REFUNDED) {
      throw new Error('La venta ya está reembolsada');
    }

    if (this._status === SaleStatus.CANCELLED) {
      throw new Error('No se puede reembolsar una venta cancelada');
    }

    this._status = SaleStatus.REFUNDED;
    this._updatedAt = new Date();
  }

  markAsCompleted(): void {
    this._status = SaleStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  updateSunatStatus(status: SunatStatus, hash?: string, xml?: string): void {
    this._sunatStatus = status;
    this._sunatHash = hash || null;
    this._sunatXml = xml || null;
    this._updatedAt = new Date();
  }

  isCompleted(): boolean {
    return this._status === SaleStatus.COMPLETED;
  }

  isCancelled(): boolean {
    return this._status === SaleStatus.CANCELLED;
  }

  isRefunded(): boolean {
    return this._status === SaleStatus.REFUNDED;
  }

  isPending(): boolean {
    return this._status === SaleStatus.PENDING;
  }

  canBeCancelled(): boolean {
    return this._status === SaleStatus.PENDING || this._status === SaleStatus.COMPLETED;
  }

  canBeRefunded(): boolean {
    return this._status === SaleStatus.COMPLETED;
  }

  getVoucherIdentifier(): string {
    return `${this._voucherType}-${this._voucherSeries}-${this._voucherNumber}`;
  }

  equals(other: Sale): boolean {
    return this._id === other._id;
  }
}
