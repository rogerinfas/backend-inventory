export interface SaleDetailData {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export class SaleDetail {
  private constructor(
    private _id: string,
    private _saleId: string,
    private _productId: string,
    private _quantity: number,
    private _unitPrice: number,
    private _discount: number,
  ) {
    this.validateQuantity();
    this.validateUnitPrice();
    this.validateDiscount();
  }

  static create(
    saleId: string,
    productId: string,
    quantity: number,
    unitPrice: number,
    discount: number = 0,
  ): SaleDetail {
    return new SaleDetail(
      crypto.randomUUID(),
      saleId,
      productId,
      quantity,
      unitPrice,
      discount,
    );
  }

  static fromPersistence(data: SaleDetailData): SaleDetail {
    return new SaleDetail(
      data.id,
      data.saleId,
      data.productId,
      data.quantity,
      data.unitPrice,
      data.discount,
    );
  }

  get id(): string {
    return this._id;
  }

  get saleId(): string {
    return this._saleId;
  }

  get productId(): string {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }

  get discount(): number {
    return this._discount;
  }

  get subtotal(): number {
    return (this._quantity * this._unitPrice) - this._discount;
  }

  private validateQuantity(): void {
    if (this._quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
  }

  private validateUnitPrice(): void {
    if (this._unitPrice < 0) {
      throw new Error('El precio unitario no puede ser negativo');
    }
  }

  private validateDiscount(): void {
    if (this._discount < 0) {
      throw new Error('El descuento no puede ser negativo');
    }
    if (this._discount > this._quantity * this._unitPrice) {
      throw new Error('El descuento no puede ser mayor al subtotal del detalle');
    }
  }
}
