import { EntityStatus } from '../enums/entity-status.enum';
import { UnitOfMeasure } from '../enums/unit-of-measure.enum';
import { Sku } from '../value-objects/sku.value-object';
import { Price } from '../value-objects/price.value-object';
import { Stock } from '../value-objects/stock.value-object';

/**
 * Entidad Product - Representa un producto en el inventario
 */
export class Product {
  private constructor(
    private readonly _id: string,
    private readonly _storeId: string,
    private readonly _sku: Sku,
    private _name: string,
    private _description: string | null,
    private _purchasePrice: Price,
    private _salePrice: Price,
    private _currentStock: Stock,
    private _minimumStock: Stock,
    private _maximumStock: Stock | null,
    private _unitOfMeasure: UnitOfMeasure,
    private _imageUrl: string | null,
    private _isActive: boolean,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _categoryId: string | null,
    private _brandId: string | null
  ) {}

  static create(
    id: string,
    storeId: string,
    sku: string,
    name: string,
    purchasePrice: number,
    salePrice: number,
    minimumStock: number = 5,
    unitOfMeasure: UnitOfMeasure = UnitOfMeasure.UNIT,
    description?: string,
    categoryId?: string,
    brandId?: string,
    imageUrl?: string
  ): Product {
    const now = new Date();

    return new Product(
      id,
      storeId,
      new Sku(sku),
      name,
      description || null,
      new Price(purchasePrice),
      new Price(salePrice),
      new Stock(0), // Stock inicial siempre es 0
      new Stock(minimumStock),
      null, // Maximum stock opcional
      unitOfMeasure,
      imageUrl || null,
      true, // isActive por defecto
      now,
      now,
      categoryId || null,
      brandId || null
    );
  }

  static fromPersistence(
    id: string,
    storeId: string,
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
    updatedAt: Date,
    categoryId: string | null,
    brandId: string | null
  ): Product {
    return new Product(
      id,
      storeId,
      new Sku(sku),
      name,
      description,
      new Price(purchasePrice),
      new Price(salePrice),
      new Stock(currentStock),
      new Stock(minimumStock),
      maximumStock ? new Stock(maximumStock) : null,
      unitOfMeasure,
      imageUrl,
      isActive,
      createdAt,
      updatedAt,
      categoryId,
      brandId
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get storeId(): string {
    return this._storeId;
  }

  get sku(): string {
    return this._sku.value;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get purchasePrice(): number {
    return this._purchasePrice.value;
  }

  get salePrice(): number {
    return this._salePrice.value;
  }

  get currentStock(): number {
    return this._currentStock.value;
  }

  get minimumStock(): number {
    return this._minimumStock.value;
  }

  get maximumStock(): number | null {
    return this._maximumStock?.value || null;
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

  get categoryId(): string | null {
    return this._categoryId;
  }

  get brandId(): string | null {
    return this._brandId;
  }

  // Métodos de negocio
  updateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('El nombre del producto debe tener al menos 2 caracteres');
    }
    if (name.length > 100) {
      throw new Error('El nombre del producto no puede exceder 100 caracteres');
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  updateDescription(description: string | null): void {
    if (description && description.length > 500) {
      throw new Error('La descripción no puede exceder 500 caracteres');
    }
    this._description = description?.trim() || null;
    this._updatedAt = new Date();
  }

  updatePurchasePrice(price: number): void {
    this._purchasePrice = new Price(price);
    this._updatedAt = new Date();
  }

  updateSalePrice(price: number): void {
    this._salePrice = new Price(price);
    this._updatedAt = new Date();
  }

  updateMinimumStock(stock: number): void {
    this._minimumStock = new Stock(stock);
    this._updatedAt = new Date();
  }

  updateMaximumStock(stock: number | null): void {
    this._maximumStock = stock ? new Stock(stock) : null;
    this._updatedAt = new Date();
  }

  updateUnitOfMeasure(unit: UnitOfMeasure): void {
    this._unitOfMeasure = unit;
    this._updatedAt = new Date();
  }

  updateImageUrl(imageUrl: string | null): void {
    if (imageUrl && imageUrl.length > 500) {
      throw new Error('La URL de imagen no puede exceder 500 caracteres');
    }
    this._imageUrl = imageUrl?.trim() || null;
    this._updatedAt = new Date();
  }

  updateCategory(categoryId: string | null): void {
    this._categoryId = categoryId;
    this._updatedAt = new Date();
  }

  updateBrand(brandId: string | null): void {
    this._brandId = brandId;
    this._updatedAt = new Date();
  }

  // Métodos de stock
  addStock(quantity: number): void {
    const stockToAdd = new Stock(quantity);
    this._currentStock = this._currentStock.add(stockToAdd);
    this._updatedAt = new Date();
  }

  removeStock(quantity: number): void {
    const stockToRemove = new Stock(quantity);
    this._currentStock = this._currentStock.subtract(stockToRemove);
    this._updatedAt = new Date();
  }

  setStock(quantity: number): void {
    this._currentStock = new Stock(quantity);
    this._updatedAt = new Date();
  }

  // Métodos de estado
  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  // Métodos de consulta
  isLowStock(): boolean {
    return this._currentStock.isLessThan(this._minimumStock);
  }

  isOutOfStock(): boolean {
    return this._currentStock.isZero();
  }

  hasStockAvailable(quantity: number): boolean {
    return this._currentStock.value >= quantity;
  }

  getMargin(): number {
    return this._salePrice.value - this._purchasePrice.value;
  }

  getMarginPercentage(): number {
    if (this._purchasePrice.value === 0) return 0;
    return ((this._salePrice.value - this._purchasePrice.value) / this._purchasePrice.value) * 100;
  }

  // Métodos de validación
  isValidForSale(): boolean {
    return this._isActive && !this.isOutOfStock();
  }

  canUpdateStock(): boolean {
    return this._isActive;
  }
}
