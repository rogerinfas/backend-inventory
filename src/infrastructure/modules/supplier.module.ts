import { Module } from '@nestjs/common';
import { SupplierController } from '../controllers/supplier.controller';
import { SupplierService } from '../../application/services/supplier.service';
import { SupplierPrismaRepository } from '../repositories/supplier.repository';
import { PersonPrismaRepository } from '../repositories/person.repository';
import { StorePrismaRepository } from '../repositories/store.repository';
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
    {
      provide: 'PersonRepository',
      useClass: PersonPrismaRepository,
    },
    {
      provide: 'StoreRepository',
      useClass: StorePrismaRepository,
    },
  ],
  exports: [SupplierService, 'SupplierRepository', 'PersonRepository', 'StoreRepository'],
})
export class SupplierModule {}
