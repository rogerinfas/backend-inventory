import { Product } from '../entities/product.entity';
import { InventoryMovement } from '../entities/inventory-movement.entity';
import { MovementType } from '../enums/movement-type.enum';
import { ProductRepository } from '../repositories/product.repository';
import { InventoryMovementRepository } from '../repositories/inventory-movement.repository';
import { ReferenceType } from '../enums/reference-type.enum';

/**
 * Servicio de dominio para gestión de inventario
 */
export class InventoryService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly inventoryMovementRepository: InventoryMovementRepository
  ) {}

  /**
   * Agrega stock a un producto
   */
  async addStock(
    productId: string,
    quantity: number,
    userId: string,
    reason?: string,
    referenceId?: string,
    referenceType?: ReferenceType
  ): Promise<InventoryMovement> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (!product.isActive) {
      throw new Error('No se puede modificar el stock de un producto inactivo');
    }

    const previousStock = product.currentStock;
    product.addStock(quantity);

    // Crear movimiento de inventario
    const movementId = this.generateId();
    const movement = InventoryMovement.create(
      movementId,
      productId,
      userId,
      MovementType.ENTRY,
      quantity,
      previousStock,
      reason,
      referenceId,
      referenceType
    );

    // Guardar cambios
    await this.productRepository.update(product);
    await this.inventoryMovementRepository.save(movement);

    return movement;
  }

  /**
   * Remueve stock de un producto
   */
  async removeStock(
    productId: string,
    quantity: number,
    userId: string,
    reason?: string,
    referenceId?: string,
    referenceType?: ReferenceType
  ): Promise<InventoryMovement> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (!product.isActive) {
      throw new Error('No se puede modificar el stock de un producto inactivo');
    }

    const previousStock = product.currentStock;
    product.removeStock(quantity);

    // Crear movimiento de inventario
    const movementId = this.generateId();
    const movement = InventoryMovement.create(
      movementId,
      productId,
      userId,
      MovementType.EXIT,
      quantity,
      previousStock,
      reason,
      referenceId,
      referenceType
    );

    // Guardar cambios
    await this.productRepository.update(product);
    await this.inventoryMovementRepository.save(movement);

    return movement;
  }

  /**
   * Ajusta el stock de un producto
   */
  async adjustStock(
    productId: string,
    newStock: number,
    userId: string,
    reason?: string
  ): Promise<InventoryMovement> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (!product.isActive) {
      throw new Error('No se puede modificar el stock de un producto inactivo');
    }

    const previousStock = product.currentStock;
    const difference = newStock - previousStock;
    
    if (difference === 0) {
      throw new Error('El nuevo stock es igual al stock actual');
    }

    product.adjustStock(newStock);

    // Crear movimiento de inventario
    const movementId = this.generateId();
    const movement = InventoryMovement.create(
      movementId,
      productId,
      userId,
      MovementType.ADJUSTMENT,
      Math.abs(difference),
      previousStock,
      reason
    );

    // Guardar cambios
    await this.productRepository.update(product);
    await this.inventoryMovementRepository.save(movement);

    return movement;
  }

  /**
   * Registra una pérdida de stock
   */
  async recordLoss(
    productId: string,
    quantity: number,
    userId: string,
    reason?: string
  ): Promise<InventoryMovement> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (!product.isActive) {
      throw new Error('No se puede modificar el stock de un producto inactivo');
    }

    const previousStock = product.currentStock;
    product.removeStock(quantity);

    // Crear movimiento de inventario
    const movementId = this.generateId();
    const movement = InventoryMovement.create(
      movementId,
      productId,
      userId,
      MovementType.LOSS,
      quantity,
      previousStock,
      reason
    );

    // Guardar cambios
    await this.productRepository.update(product);
    await this.inventoryMovementRepository.save(movement);

    return movement;
  }

  /**
   * Obtiene productos con stock bajo
   */
  async getLowStockProducts(storeId: string): Promise<Product[]> {
    return this.productRepository.findLowStock(storeId);
  }

  /**
   * Obtiene productos sin stock
   */
  async getOutOfStockProducts(storeId: string): Promise<Product[]> {
    return this.productRepository.findOutOfStock(storeId);
  }

  /**
   * Verifica si hay suficiente stock para una venta
   */
  async hasEnoughStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      return false;
    }

    return product.hasStock(quantity);
  }

  /**
   * Obtiene el historial de movimientos de un producto
   */
  async getProductMovementHistory(
    productId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<InventoryMovement[]> {
    return this.inventoryMovementRepository.findMany({
      productId,
      limit,
      offset
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
