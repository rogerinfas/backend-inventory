import { CashRegister } from '../entities/cash-register.entity';
import { CashRegisterRepository } from '../repositories/cash-register.repository';
import { CashRegisterStatus } from '../enums/cash-register-status.enum';

/**
 * Servicio de dominio para gestión de cajas registradoras
 */
export class CashRegisterService {
  constructor(
    private readonly cashRegisterRepository: CashRegisterRepository
  ) {}

  /**
   * Abre una nueva caja registradora
   */
  async openCashRegister(
    id: string,
    storeId: string,
    userId: string,
    initialAmount: number
  ): Promise<CashRegister> {
    // Verificar que no haya una caja abierta para este usuario
    const existingOpenCashRegister = await this.cashRegisterRepository.findOpenByUserId(userId);
    if (existingOpenCashRegister) {
      throw new Error('Ya tienes una caja abierta');
    }

    // Verificar que no haya una caja abierta en la tienda
    const storeOpenCashRegister = await this.cashRegisterRepository.findOpenByStoreId(storeId);
    if (storeOpenCashRegister) {
      throw new Error('Ya hay una caja abierta en esta tienda');
    }

    const cashRegister = CashRegister.open(id, storeId, userId, initialAmount);
    return this.cashRegisterRepository.save(cashRegister);
  }

  /**
   * Cierra una caja registradora
   */
  async closeCashRegister(
    cashRegisterId: string,
    finalAmount: number,
    observations?: string
  ): Promise<CashRegister> {
    const cashRegister = await this.cashRegisterRepository.findById(cashRegisterId);
    if (!cashRegister) {
      throw new Error('Caja registradora no encontrada');
    }

    if (!cashRegister.isOpen()) {
      throw new Error('La caja no está abierta');
    }

    cashRegister.close(finalAmount, observations);
    return this.cashRegisterRepository.update(cashRegister);
  }

  /**
   * Bloquea una caja registradora
   */
  async lockCashRegister(
    cashRegisterId: string,
    observations?: string
  ): Promise<CashRegister> {
    const cashRegister = await this.cashRegisterRepository.findById(cashRegisterId);
    if (!cashRegister) {
      throw new Error('Caja registradora no encontrada');
    }

    if (!cashRegister.isOpen()) {
      throw new Error('Solo se puede bloquear una caja abierta');
    }

    cashRegister.lock(observations);
    return this.cashRegisterRepository.update(cashRegister);
  }

  /**
   * Desbloquea una caja registradora
   */
  async unlockCashRegister(cashRegisterId: string): Promise<CashRegister> {
    const cashRegister = await this.cashRegisterRepository.findById(cashRegisterId);
    if (!cashRegister) {
      throw new Error('Caja registradora no encontrada');
    }

    if (!cashRegister.isLocked()) {
      throw new Error('Solo se puede desbloquear una caja bloqueada');
    }

    cashRegister.unlock();
    return this.cashRegisterRepository.update(cashRegister);
  }

  /**
   * Agrega una venta a la caja registradora
   */
  async addSaleToCashRegister(
    cashRegisterId: string,
    saleAmount: number
  ): Promise<CashRegister> {
    const cashRegister = await this.cashRegisterRepository.findById(cashRegisterId);
    if (!cashRegister) {
      throw new Error('Caja registradora no encontrada');
    }

    if (!cashRegister.isOpen()) {
      throw new Error('No se puede agregar una venta a una caja cerrada');
    }

    cashRegister.addSale(saleAmount);
    return this.cashRegisterRepository.update(cashRegister);
  }

  /**
   * Obtiene la caja abierta de un usuario
   */
  async getOpenCashRegisterByUser(userId: string): Promise<CashRegister | null> {
    return this.cashRegisterRepository.findOpenByUserId(userId);
  }

  /**
   * Obtiene la caja abierta de una tienda
   */
  async getOpenCashRegisterByStore(storeId: string): Promise<CashRegister | null> {
    return this.cashRegisterRepository.findOpenByStoreId(storeId);
  }

  /**
   * Obtiene el historial de cajas de un usuario
   */
  async getCashRegisterHistoryByUser(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<CashRegister[]> {
    return this.cashRegisterRepository.findMany({
      userId,
      limit,
      offset
    });
  }

  /**
   * Obtiene el historial de cajas de una tienda
   */
  async getCashRegisterHistoryByStore(
    storeId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<CashRegister[]> {
    return this.cashRegisterRepository.findMany({
      storeId,
      limit,
      offset
    });
  }

  /**
   * Obtiene cajas por rango de fechas
   */
  async getCashRegistersByDateRange(
    storeId: string,
    dateFrom: Date,
    dateTo: Date,
    limit: number = 50,
    offset: number = 0
  ): Promise<CashRegister[]> {
    return this.cashRegisterRepository.findMany({
      storeId,
      dateFrom,
      dateTo,
      limit,
      offset
    });
  }

  /**
   * Obtiene estadísticas de una caja
   */
  async getCashRegisterStats(cashRegisterId: string): Promise<{
    totalSales: number;
    expectedAmount: number;
    finalAmount: number | null;
    difference: number | null;
    hasDifference: boolean;
  }> {
    const cashRegister = await this.cashRegisterRepository.findById(cashRegisterId);
    if (!cashRegister) {
      throw new Error('Caja registradora no encontrada');
    }

    return {
      totalSales: cashRegister.salesAmount.amount,
      expectedAmount: cashRegister.getExpectedAmount().amount,
      finalAmount: cashRegister.finalAmount?.amount || null,
      difference: cashRegister.difference?.amount || null,
      hasDifference: cashRegister.hasDifference()
    };
  }
}
