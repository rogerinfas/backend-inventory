import { MovementType } from '../enums/movement-type.enum';
import { ReferenceType } from '../enums/reference-type.enum';

/**
 * Entidad InventoryMovement - Representa un movimiento de inventario
 */
export class InventoryMovement {
  private constructor(
    private readonly _id: string,
    private readonly _productId: string,
    private readonly _userId: string,
    private readonly _movementType: MovementType,
    private readonly _quantity: number,
    private readonly _previousStock: number,
    private readonly _newStock: number,
    private readonly _reason: string | null,
    private readonly _referenceId: string | null,
    private readonly _referenceType: ReferenceType | null,
    private readonly _movedAt: Date
  ) {}

  static create(
    id: string,
    productId: string,
    userId: string,
    movementType: MovementType,
    quantity: number,
    previousStock: number,
    reason?: string,
    referenceId?: string,
    referenceType?: ReferenceType
  ): InventoryMovement {
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a cero');
    }

    let newStock: number;
    switch (movementType) {
      case MovementType.ENTRY:
      case MovementType.RETURN:
        newStock = previousStock + quantity;
        break;
      case MovementType.EXIT:
      case MovementType.LOSS:
        if (previousStock < quantity) {
          throw new Error('No hay suficiente stock para realizar el movimiento');
        }
        newStock = previousStock - quantity;
        break;
      case MovementType.ADJUSTMENT:
        newStock = quantity; // En ajuste, la cantidad es el nuevo stock
        break;
      case MovementType.TRANSFER:
        if (previousStock < quantity) {
          throw new Error('No hay suficiente stock para transferir');
        }
        newStock = previousStock - quantity;
        break;
      default:
        throw new Error('Tipo de movimiento no válido');
    }

    const now = new Date();
    return new InventoryMovement(
      id,
      productId,
      userId,
      movementType,
      quantity,
      previousStock,
      newStock,
      reason || null,
      referenceId || null,
      referenceType || null,
      now
    );
  }

  static fromPersistence(
    id: string,
    productId: string,
    userId: string,
    movementType: MovementType,
    quantity: number,
    previousStock: number,
    newStock: number,
    reason: string | null,
    referenceId: string | null,
    referenceType: ReferenceType | null,
    movedAt: Date
  ): InventoryMovement {
    return new InventoryMovement(
      id,
      productId,
      userId,
      movementType,
      quantity,
      previousStock,
      newStock,
      reason,
      referenceId,
      referenceType,
      movedAt
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get productId(): string {
    return this._productId;
  }

  get userId(): string {
    return this._userId;
  }

  get movementType(): MovementType {
    return this._movementType;
  }

  get quantity(): number {
    return this._quantity;
  }

  get previousStock(): number {
    return this._previousStock;
  }

  get newStock(): number {
    return this._newStock;
  }

  get reason(): string | null {
    return this._reason;
  }

  get referenceId(): string | null {
    return this._referenceId;
  }

  get referenceType(): ReferenceType | null {
    return this._referenceType;
  }

  get movedAt(): Date {
    return this._movedAt;
  }

  // Métodos de negocio
  isEntry(): boolean {
    return this._movementType === MovementType.ENTRY || this._movementType === MovementType.RETURN;
  }

  isExit(): boolean {
    return this._movementType === MovementType.EXIT || this._movementType === MovementType.LOSS || this._movementType === MovementType.TRANSFER;
  }

  isAdjustment(): boolean {
    return this._movementType === MovementType.ADJUSTMENT;
  }

  hasReference(): boolean {
    return this._referenceId !== null && this._referenceType !== null;
  }

  getStockChange(): number {
    return this._newStock - this._previousStock;
  }

  equals(other: InventoryMovement): boolean {
    return this._id === other._id;
  }
}
