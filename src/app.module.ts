import { Module } from '@nestjs/common';
import { PersonModule } from './infrastructure/modules/person.module';
import { StoreModule } from './infrastructure/modules/store.module';
import { CustomerModule } from './infrastructure/modules/customer.module';
import { SupplierModule } from './infrastructure/modules/supplier.module';
import { DatabaseModule } from './infrastructure/modules/database.module';

@Module({
  imports: [DatabaseModule, PersonModule, StoreModule, CustomerModule, SupplierModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
