import { Sale } from '../entities/sale.entity';
import { VoucherType } from '../enums/voucher-type.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { SaleStatus } from '../enums/sale-status.enum';
import { SunatStatus } from '../enums/sunat-status.enum';

/**
 * Interfaz del repositorio de Ventas
 */
export interface SaleRepository {
  findById(id: string): Promise<Sale | null>;
  findByVoucher(voucherType: VoucherType, voucherSeries: string, voucherNumber: string): Promise<Sale | null>;
  findByStoreId(storeId: string): Promise<Sale[]>;
  findByCustomerId(customerId: string): Promise<Sale[]>;
  findByUserId(userId: string): Promise<Sale[]>;
  findMany(filters?: {
    storeId?: string;
    customerId?: string;
    userId?: string;
    voucherType?: VoucherType;
    paymentMethod?: PaymentMethod;
    status?: SaleStatus;
    sunatStatus?: SunatStatus;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Sale[]>;
  save(sale: Sale): Promise<Sale>;
  update(sale: Sale): Promise<Sale>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: {
    storeId?: string;
    customerId?: string;
    userId?: string;
    voucherType?: VoucherType;
    paymentMethod?: PaymentMethod;
    status?: SaleStatus;
    sunatStatus?: SunatStatus;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
  }): Promise<number>;
}
