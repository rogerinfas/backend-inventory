import { VoucherSeries } from '../entities/voucher-series.entity';
import { VoucherType } from '../enums/voucher-type.enum';

export interface VoucherSeriesQueryFilters {
  storeId?: string;
  voucherType?: VoucherType;
  series?: string;
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface VoucherSeriesRepository {
  findById(id: string): Promise<VoucherSeries | null>;
  findByStoreAndType(storeId: string, voucherType: VoucherType): Promise<VoucherSeries[]>;
  findByStoreTypeAndSeries(storeId: string, voucherType: VoucherType, series: string): Promise<VoucherSeries | null>;
  findMany(filters?: VoucherSeriesQueryFilters): Promise<VoucherSeries[]>;
  save(voucherSeries: VoucherSeries): Promise<VoucherSeries>;
  update(voucherSeries: VoucherSeries): Promise<VoucherSeries>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: VoucherSeriesQueryFilters): Promise<number>;
}
