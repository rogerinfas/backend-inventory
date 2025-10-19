import { Module } from '@nestjs/common';
import { PersonModule } from './infrastructure/modules/person.module';
import { StoreModule } from './infrastructure/modules/store.module';
import { CustomerModule } from './infrastructure/modules/customer.module';
import { SupplierModule } from './infrastructure/modules/supplier.module';
import { UserModule } from './infrastructure/modules/user.module';
import { CategoryModule } from './infrastructure/modules/category.module';
import { VoucherSeriesModule } from './infrastructure/modules/voucher-series.module';
import { DatabaseModule } from './infrastructure/modules/database.module';

@Module({
  imports: [DatabaseModule, PersonModule, StoreModule, CustomerModule, SupplierModule, UserModule, CategoryModule, VoucherSeriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
