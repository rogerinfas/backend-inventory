import { Sale } from '../entities/sale.entity';
import { Product } from '../entities/product.entity';
import { InventoryMovement } from '../entities/inventory-movement.entity';
import { SaleRepository } from '../repositories/sale.repository';
import { ProductRepository } from '../repositories/product.repository';
import { InventoryMovementRepository } from '../repositories/inventory-movement.repository';
import { VoucherType } from '../enums/voucher-type.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { SaleStatus } from '../enums/sale-status.enum';
import { SunatStatus } from '../enums/sunat-status.enum';
import { MovementType } from '../enums/movement-type.enum';
import { ReferenceType } from '../enums/reference-type.enum';

/**
 * Servicio de dominio para gestión de ventas
 */
export class SaleService {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly productRepository: ProductRepository,
    private readonly inventoryMovementRepository: InventoryMovementRepository
  ) {}

  /**
   * Crea una nueva venta
   */
  async createSale(
    id: string,
    storeId: string,
    userId: string,
    voucherType: VoucherType,
    voucherSeries: string,
    voucherNumber: string,
    issuedAt: Date,
    subtotal: number,
    tax: number = 0,
    discount: number = 0,
    paymentMethod: PaymentMethod,
    customerId?: string,
    notes?: string
  ): Promise<Sale> {
    // Verificar que no exista una venta con el mismo comprobante
    const existingSale = await this.saleRepository.findByVoucher(
      voucherType,
      voucherSeries,
      voucherNumber
    );

    if (existingSale) {
      throw new Error('Ya existe una venta con este comprobante');
    }

    // Crear la venta
    const sale = Sale.create(
      id,
      storeId,
      userId,
      voucherType,
      voucherSeries,
      voucherNumber,
      issuedAt,
      subtotal,
      tax,
      discount,
      paymentMethod,
      customerId,
      notes
    );

    return this.saleRepository.save(sale);
  }

  /**
   * Procesa una venta con productos (actualiza inventario)
   */
  async processSaleWithProducts(
    saleId: string,
    productItems: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      discount?: number;
    }>
  ): Promise<void> {
    const sale = await this.saleRepository.findById(saleId);
    if (!sale) {
      throw new Error('Venta no encontrada');
    }

    if (sale.isCancelled()) {
      throw new Error('No se puede procesar una venta cancelada');
    }

    // Verificar stock y procesar cada producto
    for (const item of productItems) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Producto no encontrado: ${item.productId}`);
      }

      if (!product.isActive) {
        throw new Error(`Producto inactivo: ${product.name}`);
      }

      if (!product.hasStock(item.quantity)) {
        throw new Error(`Stock insuficiente para el producto: ${product.name}`);
      }

      // Remover stock del producto
      const previousStock = product.currentStock;
      product.removeStock(item.quantity);

      // Crear movimiento de inventario
      const movementId = this.generateId();
      const movement = InventoryMovement.create(
        movementId,
        item.productId,
        sale.userId,
        MovementType.EXIT,
        item.quantity,
        previousStock,
        `Venta ${sale.getVoucherIdentifier()}`,
        sale.id,
        ReferenceType.SALE
      );

      // Guardar cambios
      await this.productRepository.update(product);
      await this.inventoryMovementRepository.save(movement);
    }

    // Marcar venta como completada
    sale.markAsCompleted();
    await this.saleRepository.update(sale);
  }

  /**
   * Cancela una venta
   */
  async cancelSale(saleId: string, reason?: string): Promise<void> {
    const sale = await this.saleRepository.findById(saleId);
    if (!sale) {
      throw new Error('Venta no encontrada');
    }

    if (!sale.canBeCancelled()) {
      throw new Error('No se puede cancelar esta venta');
    }

    sale.cancel();
    await this.saleRepository.update(sale);

    // Si la venta ya fue procesada, devolver stock
    if (sale.isCompleted()) {
      await this.returnStockFromSale(saleId);
    }
  }

  /**
   * Reembolsa una venta
   */
  async refundSale(saleId: string, reason?: string): Promise<void> {
    const sale = await this.saleRepository.findById(saleId);
    if (!sale) {
      throw new Error('Venta no encontrada');
    }

    if (!sale.canBeRefunded()) {
      throw new Error('No se puede reembolsar esta venta');
    }

    sale.refund();
    await this.saleRepository.update(sale);

    // Devolver stock
    await this.returnStockFromSale(saleId);
  }

  /**
   * Actualiza el estado de SUNAT
   */
  async updateSunatStatus(
    saleId: string,
    status: SunatStatus,
    hash?: string,
    xml?: string
  ): Promise<void> {
    const sale = await this.saleRepository.findById(saleId);
    if (!sale) {
      throw new Error('Venta no encontrada');
    }

    sale.updateSunatStatus(status, hash, xml);
    await this.saleRepository.update(sale);
  }

  /**
   * Obtiene ventas por rango de fechas
   */
  async getSalesByDateRange(
    storeId: string,
    dateFrom: Date,
    dateTo: Date,
    limit: number = 100,
    offset: number = 0
  ): Promise<Sale[]> {
    return this.saleRepository.findMany({
      storeId,
      dateFrom,
      dateTo,
      limit,
      offset
    });
  }

  /**
   * Obtiene ventas por cliente
   */
  async getSalesByCustomer(
    customerId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<Sale[]> {
    return this.saleRepository.findMany({
      customerId,
      limit,
      offset
    });
  }

  /**
   * Obtiene ventas por usuario
   */
  async getSalesByUser(
    userId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<Sale[]> {
    return this.saleRepository.findMany({
      userId,
      limit,
      offset
    });
  }

  /**
   * Devuelve stock de una venta cancelada/reembolsada
   */
  private async returnStockFromSale(saleId: string): Promise<void> {
    // Obtener movimientos de inventario relacionados con la venta
    const movements = await this.inventoryMovementRepository.findByReference(
      saleId,
      ReferenceType.SALE
    );

    for (const movement of movements) {
      const product = await this.productRepository.findById(movement.productId);
      if (!product) {
        continue;
      }

      // Agregar stock de vuelta
      const previousStock = product.currentStock;
      product.addStock(movement.quantity);

      // Crear movimiento de devolución
      const returnMovementId = this.generateId();
      const returnMovement = InventoryMovement.create(
        returnMovementId,
        movement.productId,
        movement.userId,
        MovementType.RETURN,
        movement.quantity,
        previousStock,
        `Devolución de venta ${saleId}`,
        saleId,
        ReferenceType.RETURN
      );

      // Guardar cambios
      await this.productRepository.update(product);
      await this.inventoryMovementRepository.save(returnMovement);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
