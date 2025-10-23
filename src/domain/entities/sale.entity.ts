import { SaleStatus, VoucherType } from '../enums';
import { SaleDetail } from './sale-detail.entity';
import { FutureDateError } from '../../application/errors/domain-errors';

export interface SaleData {
  id: string;
  storeId: string;
  customerId: string;
  userId: string;
  documentNumber?: string;
  documentType: VoucherType;
  series: string;
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
  private _details: SaleDetail[] = [];

  constructor(
    public readonly id: string,
    public readonly storeId: string,
    public readonly customerId: string,
    public readonly userId: string,
    public readonly documentNumber: string | undefined,
    public readonly documentType: VoucherType,
    public readonly series: string,
    public readonly saleDate: Date,
    public readonly subtotal: number,
    public readonly tax: number,
    public readonly discount: number,
    public readonly total: number,
    public readonly status: SaleStatus,
    public readonly notes: string | undefined,
    public readonly registeredAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validateAmounts();
    this.validateDates();
  }

  // Helpers para comparar solo fecha (Y-M-D)
  private static normalizeToStartOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private static isFutureDay(date: Date): boolean {
    const todayStart = Sale.normalizeToStartOfDay(new Date());
    const candidateStart = Sale.normalizeToStartOfDay(date);
    return candidateStart.getTime() > todayStart.getTime();
  }

  static create(
    id: string,
    storeId: string,
    customerId: string,
    userId: string,
    documentNumber: string | undefined,
    documentType: VoucherType,
    series: string,
    saleDate: Date,
    subtotal: number,
    tax: number,
    discount: number,
    notes?: string,
  ): Sale {
    const total = subtotal + tax - discount;
    const now = new Date();
    
    // Validar que la fecha de venta no sea posterior al día de hoy (se permite el mismo día)
    if (Sale.isFutureDay(saleDate)) {
      throw new FutureDateError('de venta', saleDate.toISOString());
    }

    return new Sale(
      id,
      storeId,
      customerId,
      userId,
      documentNumber,
      documentType,
      series,
      saleDate,
      subtotal,
      tax,
      discount,
      total,
      SaleStatus.PENDING,
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
      data.series,
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

  private validateAmounts(): void {
    if (this.subtotal < 0) {
      throw new Error('El subtotal no puede ser negativo');
    }
    if (this.tax < 0) {
      throw new Error('El impuesto no puede ser negativo');
    }
    if (this.discount < 0) {
      throw new Error('El descuento no puede ser negativo');
    }
    if (this.total < 0) {
      throw new Error('El total no puede ser negativo');
    }
  }

  private validateDates(): void {
    // Rechazar solo si la fecha es posterior al día actual (se permite el mismo día)
    if (Sale.isFutureDay(this.saleDate)) {
      throw new FutureDateError('de venta', this.saleDate.toISOString());
    }
    if (this.registeredAt > new Date()) {
      throw new Error('La fecha de registro no puede ser futura');
    }
    if (this.updatedAt > new Date()) {
      throw new Error('La fecha de actualización no puede ser futura');
    }
  }

  get details(): SaleDetail[] {
    return [...this._details];
  }

  addDetail(detail: SaleDetail): void {
    this._details.push(detail);
  }

  removeDetail(detailId: string): void {
    this._details = this._details.filter(detail => detail.id !== detailId);
  }

  get totalDetails(): number {
    return this._details.reduce((sum, detail) => sum + detail.totalWithDiscount, 0);
  }

  get totalQuantity(): number {
    return this._details.reduce((sum, detail) => sum + detail.quantity, 0);
  }

  get totalDiscount(): number {
    return this._details.reduce((sum, detail) => sum + detail.discountAmount, 0);
  }

  canBeCancelled(): boolean {
    return this.status === SaleStatus.PENDING || this.status === SaleStatus.COMPLETED;
  }

  canBeRefunded(): boolean {
    return this.status === SaleStatus.COMPLETED;
  }

  complete(): void {
    if (this.status !== SaleStatus.PENDING) {
      throw new Error('Solo se pueden completar ventas pendientes');
    }
    // En una implementación real, aquí se cambiaría el estado
    // Por ahora solo validamos que se puede completar
  }

  cancel(): void {
    if (!this.canBeCancelled()) {
      throw new Error('No se puede cancelar esta venta en su estado actual');
    }
    // En una implementación real, aquí se cambiaría el estado
    // Por ahora solo validamos que se puede cancelar
  }

  refund(): void {
    if (!this.canBeRefunded()) {
      throw new Error('No se puede procesar devolución de esta venta en su estado actual');
    }
    // En una implementación real, aquí se cambiaría el estado
    // Por ahora solo validamos que se puede procesar devolución
  }

  updateDocumentNumber(documentNumber: string): void {
    if (this.status !== SaleStatus.PENDING) {
      throw new Error('Solo se puede actualizar el número de documento en ventas pendientes');
    }
    // En una implementación real, aquí se actualizaría el documento
  }

  updateNotes(notes: string): void {
    // Las notas siempre se pueden actualizar
    // En una implementación real, aquí se actualizarían las notas
  }
}
