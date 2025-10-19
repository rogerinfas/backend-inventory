import { Module } from '@nestjs/common';
import { CategoryController } from '../controllers/category.controller';
import { CategoryService } from '../../application/services/category.service';
import { CategoryPrismaRepository } from '../repositories/category.repository';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [
    {
      provide: 'CategoryRepository',
      useClass: CategoryPrismaRepository,
    },
    CategoryService,
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
