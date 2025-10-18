import { Module } from '@nestjs/common';
import { SupplierController } from '../controllers/supplier.controller';
import { SupplierService } from '../../application/services/supplier.service';
import { SupplierPrismaRepository } from '../repositories/supplier.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [SupplierController],
  providers: [
    SupplierService,
    PrismaService,
    {
      provide: 'SupplierRepository',
      useClass: SupplierPrismaRepository,
    },
  ],
  exports: [SupplierService, 'SupplierRepository'],
})
export class SupplierModule {}
