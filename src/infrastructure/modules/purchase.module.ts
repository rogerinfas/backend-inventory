import { Module } from '@nestjs/common';
import { PurchaseController } from '../controllers/purchase.controller';
import { PurchaseService } from '../../application/services/purchase.service';
import { PurchasePrismaRepository } from '../repositories/purchase.repository';
import { StorePrismaRepository } from '../repositories/store.repository';
import { SupplierPrismaRepository } from '../repositories/supplier.repository';
import { UserPrismaRepository } from '../repositories/user.repository';
import { ProductPrismaRepository } from '../repositories/product.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [PurchaseController],
  providers: [
    PurchaseService,
    PrismaService,
    {
      provide: 'PurchaseRepository',
      useClass: PurchasePrismaRepository,
    },
    {
      provide: 'StoreRepository',
      useClass: StorePrismaRepository,
    },
    {
      provide: 'SupplierRepository',
      useClass: SupplierPrismaRepository,
    },
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
    {
      provide: 'ProductRepository',
      useClass: ProductPrismaRepository,
    },
  ],
  exports: [PurchaseService, 'PurchaseRepository'],
})
export class PurchaseModule {}
