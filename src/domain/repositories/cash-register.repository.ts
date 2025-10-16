import { CashRegister } from '../entities/cash-register.entity';
import { CashRegisterStatus } from '../enums/cash-register-status.enum';

/**
 * Interfaz del repositorio de Cajas Registradoras
 */
export interface CashRegisterRepository {
  findById(id: string): Promise<CashRegister | null>;
  findByStoreId(storeId: string): Promise<CashRegister[]>;
  findByUserId(userId: string): Promise<CashRegister[]>;
  findOpenByStoreId(storeId: string): Promise<CashRegister | null>;
  findOpenByUserId(userId: string): Promise<CashRegister | null>;
  findMany(filters?: {
    storeId?: string;
    userId?: string;
    status?: CashRegisterStatus;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  }): Promise<CashRegister[]>;
  save(cashRegister: CashRegister): Promise<CashRegister>;
  update(cashRegister: CashRegister): Promise<CashRegister>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: {
    storeId?: string;
    userId?: string;
    status?: CashRegisterStatus;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<number>;
}
