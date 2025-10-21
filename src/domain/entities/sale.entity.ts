import { SaleStatus } from '../enums/sale-status.enum';
import { SaleDocumentType } from '../enums/sale-document-type.enum';
import { SaleDetail } from './sale-detail.entity';

export interface SaleData {
  id: string;
  storeId: string;
  customerId: string;
  userId: string;
  documentNumber?: string;
  documentType: SaleDocumentType;
  saleDate: Date;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: SaleStatus;
  notes?: string;
  registeredAt: Date;
  updatedAt: Date;
}

export class Sale {
  private constructor(
    private _id: string,
    private _storeId: string,
    private _customerId: string,
    private _userId: string,
    private _documentNumber: string | undefined,
    private _documentType: SaleDocumentType,
    private _saleDate: Date,
    private _subtotal: number,
    private _tax: number,
    private _discount: number,
    private _total: number,
    private _status: SaleStatus,
    private _notes: string | undefined,
    private _registeredAt: Date,
    private _updatedAt: Date,
  ) {
    this.validateDates();
    this.validateAmounts();
  }

  static create(
    storeId: string,
    customerId: string,
    userId: string,
    documentNumber: string | undefined,
    documentType: SaleDocumentType,
    saleDate: Date,
    subtotal: number,
    tax: number = 0,
    discount: number = 0,
    notes: string | undefined = undefined,
  ): Sale {
    const total = subtotal + tax - discount;
    const now = new Date();
    
    // Validar que la fecha de venta no sea futura (solo si el día es posterior)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const saleDay = new Date(saleDate.getFullYear(), saleDate.getMonth(), saleDate.getDate());

    if (saleDay > today) {
      throw new Error('La fecha de venta no puede ser futura');
    }

    return new Sale(
      crypto.randomUUID(),
      storeId,
      customerId,
      userId,
      documentNumber,
      documentType,
      saleDate,
      subtotal,
      tax,
      discount,
      total,
      SaleStatus.PENDING, // Siempre inicia como PENDING
      notes,
      now,
      now,
    );
  }

  static fromPersistence(data: SaleData): Sale {
    return new Sale(
      data.id,
      data.storeId,
      data.customerId,
      data.userId,
      data.documentNumber,
      data.documentType,
      data.saleDate,
      data.subtotal,
      data.tax,
      data.discount,
      data.total,
      data.status,
      data.notes,
      data.registeredAt,
      data.updatedAt,
    );
  }

  get id(): string {
    return this._id;
  }

  get storeId(): string {
    return this._storeId;
  }

  get customerId(): string {
    return this._customerId;
  }

  get userId(): string {
    return this._userId;
  }

  get documentNumber(): string | undefined {
    return this._documentNumber;
  }

  get documentType(): SaleDocumentType {
    return this._documentType;
  }

  get saleDate(): Date {
    return this._saleDate;
  }

  get subtotal(): number {
    return this._subtotal;
  }

  get tax(): number {
    return this._tax;
  }

  get discount(): number {
    return this._discount;
  }

  get total(): number {
    return this._total;
  }

  get status(): SaleStatus {
    return this._status;
  }

  get notes(): string | undefined {
    return this._notes;
  }

  get registeredAt(): Date {
    return this._registeredAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  complete(): void {
    if (this._status !== SaleStatus.PENDING) {
      throw new Error('Solo se pueden completar ventas pendientes');
    }
    this._status = SaleStatus.COMPLETED;
    this._updatedAt = new Date();
  }

  cancel(): void {
    if (this._status !== SaleStatus.PENDING) {
      throw new Error('Solo se pueden cancelar ventas pendientes');
    }
    this._status = SaleStatus.CANCELLED;
    this._updatedAt = new Date();
  }

  refund(): void {
    if (this._status !== SaleStatus.COMPLETED) {
      throw new Error('Solo se pueden reembolsar ventas completadas');
    }
    this._status = SaleStatus.REFUNDED;
    this._updatedAt = new Date();
  }

  private validateDates(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const saleDay = new Date(this._saleDate.getFullYear(), this._saleDate.getMonth(), this._saleDate.getDate());

    if (saleDay > today) {
      throw new Error('La fecha de venta no puede ser futura');
    }
    if (this._registeredAt > now) {
      throw new Error('La fecha de registro no puede ser futura');
    }
    if (this._updatedAt > now) {
      throw new Error('La fecha de actualización no puede ser futura');
    }
  }

  private validateAmounts(): void {
    if (this._subtotal < 0) {
      throw new Error('El subtotal no puede ser negativo');
    }
    if (this._tax < 0) {
      throw new Error('El impuesto no puede ser negativo');
    }
    if (this._discount < 0) {
      throw new Error('El descuento no puede ser negativo');
    }
    if (this._total < 0) {
      throw new Error('El total no puede ser negativo');
    }
  }
}
