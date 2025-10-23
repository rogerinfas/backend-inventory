import { Module } from '@nestjs/common';
import { SaleController } from '../controllers/sale.controller';
import { SaleService } from '../../application/services/sale.service';
import { SalePrismaRepository } from '../repositories/sale.repository';
import { StorePrismaRepository } from '../repositories/store.repository';
import { CustomerPrismaRepository } from '../repositories/customer.repository';
import { UserPrismaRepository } from '../repositories/user.repository';
import { ProductPrismaRepository } from '../repositories/product.repository';
import { VoucherSeriesPrismaRepository } from '../repositories/voucher-series.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [SaleController],
  providers: [
    SaleService,
    PrismaService,
    {
      provide: 'SaleRepository',
      useClass: SalePrismaRepository,
    },
    {
      provide: 'StoreRepository',
      useClass: StorePrismaRepository,
    },
    {
      provide: 'CustomerRepository',
      useClass: CustomerPrismaRepository,
    },
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
    {
      provide: 'ProductRepository',
      useClass: ProductPrismaRepository,
    },
    {
      provide: 'VoucherSeriesRepository',
      useClass: VoucherSeriesPrismaRepository,
    },
  ],
  exports: [SaleService, 'SaleRepository'],
})
export class SaleModule {}
