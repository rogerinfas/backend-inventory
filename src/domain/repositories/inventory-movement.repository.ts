import { InventoryMovement } from '../entities/inventory-movement.entity';
import { MovementType } from '../enums/movement-type.enum';
import { ReferenceType } from '../enums/reference-type.enum';

/**
 * Interfaz del repositorio de Movimientos de Inventario
 */
export interface InventoryMovementRepository {
  findById(id: string): Promise<InventoryMovement | null>;
  findByProductId(productId: string): Promise<InventoryMovement[]>;
  findByUserId(userId: string): Promise<InventoryMovement[]>;
  findByReference(referenceId: string, referenceType: ReferenceType): Promise<InventoryMovement[]>;
  findMany(filters?: {
    productId?: string;
    userId?: string;
    movementType?: MovementType;
    referenceType?: ReferenceType;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  }): Promise<InventoryMovement[]>;
  save(movement: InventoryMovement): Promise<InventoryMovement>;
  update(movement: InventoryMovement): Promise<InventoryMovement>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: {
    productId?: string;
    userId?: string;
    movementType?: MovementType;
    referenceType?: ReferenceType;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<number>;
}
