import { Module } from '@nestjs/common';
import { CustomerController } from '../controllers/customer.controller';
import { CustomerService } from '../../application/services/customer.service';
import { CustomerPrismaRepository } from '../repositories/customer.repository';
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
  ],
  exports: [CustomerService, 'CustomerRepository'],
})
export class CustomerModule {}
