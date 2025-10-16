import { SKU } from '../value-objects/sku.value-object';
import { Money } from '../value-objects/money.value-object';
import { UnitOfMeasure } from '../enums/unit-of-measure.enum';

/**
 * Entidad Product - Representa un producto en el inventario
 */
export class Product {
  private constructor(
    private readonly _id: string,
    private readonly _storeId: string,
    private readonly _categoryId: string | null,
    private readonly _brandId: string | null,
    private readonly _sku: SKU,
    private _name: string,
    private _description: string | null,
    private _purchasePrice: Money,
    private _salePrice: Money,
    private _currentStock: number,
    private _minimumStock: number,
    private _maximumStock: number | null,
    private _unitOfMeasure: UnitOfMeasure,
    private _imageUrl: string | null,
    private _isActive: boolean,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    id: string,
    storeId: string,
    sku: string,
    name: string,
    purchasePrice: number,
    salePrice: number,
    categoryId?: string,
    brandId?: string,
    description?: string,
    minimumStock: number = 5,
    maximumStock?: number,
    unitOfMeasure: UnitOfMeasure = UnitOfMeasure.UNIT,
    imageUrl?: string
  ): Product {
    if (!name || name.trim().length === 0) {
      throw new Error('El nombre del producto no puede estar vacío');
    }

    if (purchasePrice < 0) {
      throw new Error('El precio de compra no puede ser negativo');
    }

    if (salePrice < 0) {
      throw new Error('El precio de venta no puede ser negativo');
    }

    if (minimumStock < 0) {
      throw new Error('El stock mínimo no puede ser negativo');
    }

    if (maximumStock !== undefined && maximumStock < minimumStock) {
      throw new Error('El stock máximo no puede ser menor al stock mínimo');
    }

    const skuValue = new SKU(sku);
    const purchasePriceValue = new Money(purchasePrice);
    const salePriceValue = new Money(salePrice);
    const now = new Date();

    return new Product(
      id,
      storeId,
      categoryId || null,
      brandId || null,
      skuValue,
      name.trim(),
      description?.trim() || null,
      purchasePriceValue,
      salePriceValue,
      0, // Stock inicial en 0
      minimumStock,
      maximumStock || null,
      unitOfMeasure,
      imageUrl || null,
      true,
      now,
      now
    );
  }

  static fromPersistence(
    id: string,
    storeId: string,
    categoryId: string | null,
    brandId: string | null,
    sku: string,
    name: string,
    description: string | null,
    purchasePrice: number,
    salePrice: number,
    currentStock: number,
    minimumStock: number,
    maximumStock: number | null,
    unitOfMeasure: UnitOfMeasure,
    imageUrl: string | null,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
  ): Product {
    const skuValue = new SKU(sku);
    const purchasePriceValue = new Money(purchasePrice);
    const salePriceValue = new Money(salePrice);

    return new Product(
      id,
      storeId,
      categoryId,
      brandId,
      skuValue,
      name,
      description,
      purchasePriceValue,
      salePriceValue,
      currentStock,
      minimumStock,
      maximumStock,
      unitOfMeasure,
      imageUrl,
      isActive,
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

  get categoryId(): string | null {
    return this._categoryId;
  }

  get brandId(): string | null {
    return this._brandId;
  }

  get sku(): SKU {
    return this._sku;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get purchasePrice(): Money {
    return this._purchasePrice;
  }

  get salePrice(): Money {
    return this._salePrice;
  }

  get currentStock(): number {
    return this._currentStock;
  }

  get minimumStock(): number {
    return this._minimumStock;
  }

  get maximumStock(): number | null {
    return this._maximumStock;
  }

  get unitOfMeasure(): UnitOfMeasure {
    return this._unitOfMeasure;
  }

  get imageUrl(): string | null {
    return this._imageUrl;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de negocio
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('El nombre del producto no puede estar vacío');
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  updateDescription(description: string | null): void {
    this._description = description?.trim() || null;
    this._updatedAt = new Date();
  }

  updatePurchasePrice(price: number): void {
    if (price < 0) {
      throw new Error('El precio de compra no puede ser negativo');
    }
    this._purchasePrice = new Money(price);
    this._updatedAt = new Date();
  }

  updateSalePrice(price: number): void {
    if (price < 0) {
      throw new Error('El precio de venta no puede ser negativo');
    }
    this._salePrice = new Money(price);
    this._updatedAt = new Date();
  }

  updateStockLimits(minimumStock: number, maximumStock?: number): void {
    if (minimumStock < 0) {
      throw new Error('El stock mínimo no puede ser negativo');
    }

    if (maximumStock !== undefined && maximumStock < minimumStock) {
      throw new Error('El stock máximo no puede ser menor al stock mínimo');
    }

    this._minimumStock = minimumStock;
    this._maximumStock = maximumStock || null;
    this._updatedAt = new Date();
  }

  updateUnitOfMeasure(unitOfMeasure: UnitOfMeasure): void {
    this._unitOfMeasure = unitOfMeasure;
    this._updatedAt = new Date();
  }

  updateImageUrl(imageUrl: string | null): void {
    this._imageUrl = imageUrl;
    this._updatedAt = new Date();
  }

  addStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('La cantidad a agregar debe ser mayor a cero');
    }

    const newStock = this._currentStock + quantity;
    
    if (this._maximumStock !== null && newStock > this._maximumStock) {
      throw new Error('El stock excede el máximo permitido');
    }

    this._currentStock = newStock;
    this._updatedAt = new Date();
  }

  removeStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('La cantidad a remover debe ser mayor a cero');
    }

    if (this._currentStock < quantity) {
      throw new Error('No hay suficiente stock disponible');
    }

    this._currentStock -= quantity;
    this._updatedAt = new Date();
  }

  adjustStock(newStock: number): void {
    if (newStock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    if (this._maximumStock !== null && newStock > this._maximumStock) {
      throw new Error('El stock excede el máximo permitido');
    }

    this._currentStock = newStock;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  isLowStock(): boolean {
    return this._currentStock <= this._minimumStock;
  }

  isOutOfStock(): boolean {
    return this._currentStock === 0;
  }

  hasStock(quantity: number): boolean {
    return this._currentStock >= quantity;
  }

  getProfitMargin(): number {
    const profit = this._salePrice.amount - this._purchasePrice.amount;
    return this._purchasePrice.amount > 0 ? (profit / this._purchasePrice.amount) * 100 : 0;
  }

  equals(other: Product): boolean {
    return this._id === other._id;
  }
}
