import { Module } from '@nestjs/common';
import { CustomerController } from '../controllers/customer.controller';
import { CustomerService } from '../../application/services/customer.service';
import { CustomerPrismaRepository } from '../repositories/customer.repository';
import { PersonPrismaRepository } from '../repositories/person.repository';
import { StorePrismaRepository } from '../repositories/store.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [CustomerController],
  providers: [
    CustomerService,
    PrismaService,
    {
      provide: 'CustomerRepository',
      useClass: CustomerPrismaRepository,
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
  exports: [CustomerService, 'CustomerRepository', 'PersonRepository', 'StoreRepository'],
})
export class CustomerModule {}
