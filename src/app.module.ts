import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PersonModule } from './infrastructure/modules/person.module';
import { StoreModule } from './infrastructure/modules/store.module';
import { CustomerModule } from './infrastructure/modules/customer.module';
import { SupplierModule } from './infrastructure/modules/supplier.module';
import { UserModule } from './infrastructure/modules/user.module';
import { CategoryModule } from './infrastructure/modules/category.module';
import { VoucherSeriesModule } from './infrastructure/modules/voucher-series.module';
import { BrandModule } from './infrastructure/modules/brand.module';
import { ProductModule } from './infrastructure/modules/product.module';
import { SunatConfigModule } from './infrastructure/modules/sunat-config.module';
import { PurchaseModule } from './infrastructure/modules/purchase.module';
import { SaleModule } from './infrastructure/modules/sale.module';
import { DatabaseModule } from './infrastructure/modules/database.module';
import { AuthModule } from './infrastructure/modules/auth.module';
import { DataInitializationModule } from './infrastructure/modules/data-initialization.module';
import { DashboardModule } from './infrastructure/modules/dashboard.module';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { StoreScopeGuard } from './infrastructure/guards/store-scope.guard';

@Module({
  imports: [
    DatabaseModule, 
    PersonModule, 
    StoreModule, 
    CustomerModule, 
    SupplierModule, 
    UserModule, 
    CategoryModule, 
    VoucherSeriesModule, 
    BrandModule, 
    ProductModule, 
    SunatConfigModule, 
    PurchaseModule, 
    SaleModule, 
    AuthModule,
    DataInitializationModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [
    // Guards aplicados globalmente
    // El orden importa: primero autenticación, luego filtrado por store
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: StoreScopeGuard,
    },
  ],
})
export class AppModule {}
