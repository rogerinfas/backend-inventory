import { Module } from '@nestjs/common';
import { BrandController } from '../controllers/brand.controller';
import { BrandService } from '../../application/services/brand.service';
import { BrandPrismaRepository } from '../repositories/brand.repository';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BrandController],
  providers: [
    {
      provide: 'BrandRepository',
      useClass: BrandPrismaRepository,
    },
    BrandService,
  ],
  exports: [BrandService],
})
export class BrandModule {}
