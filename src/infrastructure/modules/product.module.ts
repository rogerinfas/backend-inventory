import { Module } from '@nestjs/common';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../../application/services/product.service';
import { ProductPrismaRepository } from '../repositories/product.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    {
      provide: 'ProductRepository',
      useClass: ProductPrismaRepository,
    },
  ],
  exports: [ProductService, 'ProductRepository'],
})
export class ProductModule {}
