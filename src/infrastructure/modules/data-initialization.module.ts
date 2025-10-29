import { Module, OnModuleInit } from '@nestjs/common';
import { DataInitializationService } from '../../application/services/data-initialization.service';
import { CreateUserWithPersonUseCase } from '../../application/use-cases/user/create-user-with-person.use-case';
import { CreateCategoryUseCase } from '../../application/use-cases/category/create-category.use-case';
import { CreateBrandUseCase } from '../../application/use-cases/brand/create-brand.use-case';
import { CreateProductUseCase } from '../../application/use-cases/product/create-product.use-case';
import { AddStockUseCase } from '../../application/use-cases/product/add-stock.use-case';
import { CreateSupplierUseCase } from '../../application/use-cases/supplier/create-supplier.use-case';
import { CreateCustomerUseCase } from '../../application/use-cases/customer/create-customer.use-case';
import { CreateSupplierWithPersonUseCase } from '../../application/use-cases/supplier/create-supplier-with-person.use-case';
import { CreateCustomerWithPersonUseCase } from '../../application/use-cases/customer/create-customer-with-person.use-case';
import { CreateVoucherSeriesUseCase } from '../../application/use-cases/voucher-series/create-voucher-series.use-case';
import { CreateSunatConfigUseCase } from '../../application/use-cases/sunat-config/create-sunat-config.use-case';
import { CreatePurchaseUseCase } from '../../application/use-cases/purchase/create-purchase.use-case';
import { CreateSaleUseCase } from '../../application/use-cases/sale/create-sale.use-case';
import { UserPrismaRepository } from '../repositories/user.repository';
import { PersonPrismaRepository } from '../repositories/person.repository';
import { CategoryPrismaRepository } from '../repositories/category.repository';
import { BrandPrismaRepository } from '../repositories/brand.repository';
import { ProductPrismaRepository } from '../repositories/product.repository';
import { StorePrismaRepository } from '../repositories/store.repository';
import { SupplierPrismaRepository } from '../repositories/supplier.repository';
import { CustomerPrismaRepository } from '../repositories/customer.repository';
import { VoucherSeriesPrismaRepository } from '../repositories/voucher-series.repository';
import { SunatConfigPrismaRepository } from '../repositories/sunat-config.repository';
import { PurchasePrismaRepository } from '../repositories/purchase.repository';
import { SalePrismaRepository } from '../repositories/sale.repository';
import { DatabaseModule } from './database.module';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    DataInitializationService,
    CreateUserWithPersonUseCase,
    CreateCategoryUseCase,
    CreateBrandUseCase,
    CreateProductUseCase,
    AddStockUseCase,
    CreateSupplierUseCase,
    CreateCustomerUseCase,
    CreateSupplierWithPersonUseCase,
    CreateCustomerWithPersonUseCase,
    CreateVoucherSeriesUseCase,
    CreateSunatConfigUseCase,
    CreatePurchaseUseCase,
    CreateSaleUseCase,
    UserPrismaRepository,
    PersonPrismaRepository,
    CategoryPrismaRepository,
    BrandPrismaRepository,
    ProductPrismaRepository,
    StorePrismaRepository,
    SupplierPrismaRepository,
    CustomerPrismaRepository,
    VoucherSeriesPrismaRepository,
    SunatConfigPrismaRepository,
    PurchasePrismaRepository,
    SalePrismaRepository,
    PrismaService,
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
    {
      provide: 'PersonRepository',
      useClass: PersonPrismaRepository,
    },
    {
      provide: 'CategoryRepository',
      useClass: CategoryPrismaRepository,
    },
    {
      provide: 'BrandRepository',
      useClass: BrandPrismaRepository,
    },
    {
      provide: 'ProductRepository',
      useClass: ProductPrismaRepository,
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
      provide: 'CustomerRepository',
      useClass: CustomerPrismaRepository,
    },
    {
      provide: 'VoucherSeriesRepository',
      useClass: VoucherSeriesPrismaRepository,
    },
    {
      provide: 'SunatConfigRepository',
      useClass: SunatConfigPrismaRepository,
    },
    {
      provide: 'PurchaseRepository',
      useClass: PurchasePrismaRepository,
    },
    {
      provide: 'SaleRepository',
      useClass: SalePrismaRepository,
    },
  ],
  exports: [DataInitializationService],
})
export class DataInitializationModule implements OnModuleInit {
  constructor(
    private readonly dataInitializationService: DataInitializationService,
  ) {}

  async onModuleInit() {
    // Initialize superadmin when the module is loaded
    await this.dataInitializationService.initializeSuperadmin();
  }
}
