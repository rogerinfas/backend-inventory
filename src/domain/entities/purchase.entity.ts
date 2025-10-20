import { PurchaseStatus, PurchaseDocumentType } from '../enums';
import { PurchaseDetail } from './purchase-detail.entity';
import { FutureDateError } from '../../application/errors/domain-errors';

export interface PurchaseData {
  id: string;
  storeId: string;
  supplierId: string;
  userId: string;
  documentNumber?: string;
  documentType: PurchaseDocumentType;
  purchaseDate: Date;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: PurchaseStatus;
  notes?: string;
  registeredAt: Date;
  updatedAt: Date;
}

export class Purchase {
  private _details: PurchaseDetail[] = [];

  constructor(
    public readonly id: string,
    public readonly storeId: string,
    public readonly supplierId: string,
    public readonly userId: string,
    public readonly documentNumber: string | undefined,
    public readonly documentType: PurchaseDocumentType,
    public readonly purchaseDate: Date,
    public readonly subtotal: number,
    public readonly tax: number,
    public readonly discount: number,
    public readonly total: number,
    public readonly status: PurchaseStatus,
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
    const todayStart = Purchase.normalizeToStartOfDay(new Date());
    const candidateStart = Purchase.normalizeToStartOfDay(date);
    return candidateStart.getTime() > todayStart.getTime();
  }

  static create(
    id: string,
    storeId: string,
    supplierId: string,
    userId: string,
    documentNumber: string | undefined,
    documentType: PurchaseDocumentType,
    purchaseDate: Date,
    subtotal: number,
    tax: number,
    discount: number,
    notes?: string,
  ): Purchase {
    const total = subtotal + tax - discount;
    const now = new Date();
    
    // Validar que la fecha de compra no sea posterior al día de hoy (se permite el mismo día)
    if (Purchase.isFutureDay(purchaseDate)) {
      throw new FutureDateError('de compra', purchaseDate.toISOString());
    }

    return new Purchase(
      id,
      storeId,
      supplierId,
      userId,
      documentNumber,
      documentType,
      purchaseDate,
      subtotal,
      tax,
      discount,
      total,
      PurchaseStatus.REGISTERED,
      notes,
      now,
      now,
    );
  }

  static fromPersistence(data: PurchaseData): Purchase {
    return new Purchase(
      data.id,
      data.storeId,
      data.supplierId,
      data.userId,
      data.documentNumber,
      data.documentType,
      data.purchaseDate,
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
    if (Purchase.isFutureDay(this.purchaseDate)) {
      throw new FutureDateError('de compra', this.purchaseDate.toISOString());
    }
    if (this.registeredAt > new Date()) {
      throw new Error('La fecha de registro no puede ser futura');
    }
    if (this.updatedAt > new Date()) {
      throw new Error('La fecha de actualización no puede ser futura');
    }
  }

  get details(): PurchaseDetail[] {
    return [...this._details];
  }

  addDetail(detail: PurchaseDetail): void {
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
    return this.status === PurchaseStatus.REGISTERED || this.status === PurchaseStatus.PENDING;
  }

  canBeReceived(): boolean {
    return this.status === PurchaseStatus.REGISTERED;
  }

  cancel(): void {
    if (!this.canBeCancelled()) {
      throw new Error('No se puede cancelar esta compra en su estado actual');
    }
    // En una implementación real, aquí se cambiaría el estado
    // Por ahora solo validamos que se puede cancelar
  }

  markAsReceived(): void {
    if (!this.canBeReceived()) {
      throw new Error('No se puede marcar como recibida esta compra en su estado actual');
    }
    // En una implementación real, aquí se cambiaría el estado
    // Por ahora solo validamos que se puede marcar como recibida
  }

  updateDocumentNumber(documentNumber: string): void {
    if (this.status !== PurchaseStatus.PENDING) {
      throw new Error('Solo se puede actualizar el número de documento en compras pendientes');
    }
    // En una implementación real, aquí se actualizaría el documento
  }

  updateNotes(notes: string): void {
    // Las notas siempre se pueden actualizar
    // En una implementación real, aquí se actualizarían las notas
  }
}
