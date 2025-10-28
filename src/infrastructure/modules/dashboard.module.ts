import { Module } from '@nestjs/common';
import { DashboardController } from '../controllers/dashboard.controller';
import { DashboardService } from '../../application/services/dashboard.service';
import { GetSellerStatsUseCase, GetAdminStatsUseCase, GetSuperadminStatsUseCase } from '../../application/use-cases/dashboard';
import { SalePrismaRepository } from '../repositories/sale.repository';
import { ProductPrismaRepository } from '../repositories/product.repository';
import { CustomerPrismaRepository } from '../repositories/customer.repository';
import { StorePrismaRepository } from '../repositories/store.repository';
import { UserPrismaRepository } from '../repositories/user.repository';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    GetSellerStatsUseCase,
    GetAdminStatsUseCase,
    GetSuperadminStatsUseCase,
    SalePrismaRepository,
    ProductPrismaRepository,
    CustomerPrismaRepository,
    StorePrismaRepository,
    UserPrismaRepository,
    {
      provide: 'SaleRepository',
      useClass: SalePrismaRepository,
    },
    {
      provide: 'ProductRepository',
      useClass: ProductPrismaRepository,
    },
    {
      provide: 'CustomerRepository',
      useClass: CustomerPrismaRepository,
    },
    {
      provide: 'StoreRepository',
      useClass: StorePrismaRepository,
    },
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
  ],
  exports: [DashboardService],
})
export class DashboardModule {}

