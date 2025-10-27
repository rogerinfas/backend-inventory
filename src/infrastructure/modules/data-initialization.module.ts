
import { Module, OnModuleInit } from '@nestjs/common';
import { DataInitializationService } from '../../application/services/data-initialization.service';
import { CreateUserWithPersonUseCase } from '../../application/use-cases/user/create-user-with-person.use-case';
import { CreateCategoryUseCase } from '../../application/use-cases/category/create-category.use-case';
import { CreateBrandUseCase } from '../../application/use-cases/brand/create-brand.use-case';
import { CreateProductUseCase } from '../../application/use-cases/product/create-product.use-case';
import { AddStockUseCase } from '../../application/use-cases/product/add-stock.use-case';
import { UserPrismaRepository } from '../repositories/user.repository';
import { PersonPrismaRepository } from '../repositories/person.repository';
import { CategoryPrismaRepository } from '../repositories/category.repository';
import { BrandPrismaRepository } from '../repositories/brand.repository';
import { ProductPrismaRepository } from '../repositories/product.repository';
import { StorePrismaRepository } from '../repositories/store.repository';
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
    UserPrismaRepository,
    PersonPrismaRepository,
    CategoryPrismaRepository,
    BrandPrismaRepository,
    ProductPrismaRepository,
    StorePrismaRepository,
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
