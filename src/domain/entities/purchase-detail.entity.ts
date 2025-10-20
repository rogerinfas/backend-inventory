import { PurchaseStatus, PurchaseDocumentType } from '../enums';

export interface PurchaseDetailData {
  id: string;
  purchaseId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export class PurchaseDetail {
  constructor(
    public readonly id: string,
    public readonly purchaseId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly discount: number = 0,
  ) {
    this.validateQuantity();
    this.validateUnitPrice();
    this.validateDiscount();
  }

  static create(
    id: string,
    purchaseId: string,
    productId: string,
    quantity: number,
    unitPrice: number,
    discount: number = 0,
  ): PurchaseDetail {
    return new PurchaseDetail(id, purchaseId, productId, quantity, unitPrice, discount);
  }

  static fromPersistence(data: PurchaseDetailData): PurchaseDetail {
    return new PurchaseDetail(
      data.id,
      data.purchaseId,
      data.productId,
      data.quantity,
      data.unitPrice,
      data.discount,
    );
  }

  private validateQuantity(): void {
    if (this.quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
  }

  private validateUnitPrice(): void {
    if (this.unitPrice <= 0) {
      throw new Error('El precio unitario debe ser mayor a 0');
    }
  }

  private validateDiscount(): void {
    if (this.discount < 0) {
      throw new Error('El descuento no puede ser negativo');
    }
    if (this.discount > this.unitPrice) {
      throw new Error('El descuento no puede ser mayor al precio unitario');
    }
  }

  get subtotal(): number {
    return this.quantity * this.unitPrice;
  }

  get totalWithDiscount(): number {
    return this.subtotal - this.discount;
  }

  get discountAmount(): number {
    return this.discount;
  }

  get discountPercentage(): number {
    if (this.subtotal === 0) return 0;
    return (this.discount / this.subtotal) * 100;
  }
}
