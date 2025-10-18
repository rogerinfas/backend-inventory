import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CustomerRepository, CustomerQueryFilters } from '../../domain/repositories/customer.repository';
import { Customer } from '../../domain/entities/customer.entity';
import { EntityStatus } from '../../domain/enums/entity-status.enum';

@Injectable()
export class CustomerPrismaRepository implements CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Customer | null> {
    const customerData = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customerData) {
      return null;
    }

    return Customer.fromPersistence(
      customerData.id,
      customerData.storeId,
      customerData.personId,
      customerData.status as EntityStatus,
      customerData.registeredAt,
      customerData.updatedAt,
    );
  }

  async findByStoreId(storeId: string): Promise<Customer[]> {
    const customersData = await this.prisma.customer.findMany({
      where: { storeId },
    });

    return customersData.map(customerData =>
      Customer.fromPersistence(
        customerData.id,
        customerData.storeId,
        customerData.personId,
        customerData.status as EntityStatus,
        customerData.registeredAt,
        customerData.updatedAt,
      )
    );
  }

  async findByPersonId(personId: string): Promise<Customer | null> {
    const customerData = await this.prisma.customer.findFirst({
      where: { personId },
    });

    if (!customerData) {
      return null;
    }

    return Customer.fromPersistence(
      customerData.id,
      customerData.storeId,
      customerData.personId,
      customerData.status as EntityStatus,
      customerData.registeredAt,
      customerData.updatedAt,
    );
  }

  async findByStoreAndPerson(storeId: string, personId: string): Promise<Customer | null> {
    const customerData = await this.prisma.customer.findFirst({
      where: {
        storeId,
        personId,
      },
    });

    if (!customerData) {
      return null;
    }

    return Customer.fromPersistence(
      customerData.id,
      customerData.storeId,
      customerData.personId,
      customerData.status as EntityStatus,
      customerData.registeredAt,
      customerData.updatedAt,
    );
  }

  async findMany(filters?: CustomerQueryFilters): Promise<Customer[]> {
    const where: any = {};

    if (filters?.storeId) {
      where.storeId = filters.storeId;
    }

    if (filters?.personId) {
      where.personId = filters.personId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { id: { contains: filters.search, mode: 'insensitive' } },
        { storeId: { contains: filters.search, mode: 'insensitive' } },
        { personId: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const customersData = await this.prisma.customer.findMany({
      where,
      skip: filters?.offset || 0,
      take: filters?.limit || 10,
      orderBy: {
        [filters?.sortBy || 'registeredAt']: filters?.sortOrder || 'desc',
      },
    });

    return customersData.map(customerData =>
      Customer.fromPersistence(
        customerData.id,
        customerData.storeId,
        customerData.personId,
        customerData.status as EntityStatus,
        customerData.registeredAt,
        customerData.updatedAt,
      )
    );
  }

  async save(customer: Customer): Promise<Customer> {
    const customerData = await this.prisma.customer.create({
      data: {
        id: customer.id,
        storeId: customer.storeId,
        personId: customer.personId,
        status: customer.status,
        registeredAt: customer.registeredAt,
        updatedAt: customer.updatedAt,
      },
    });

    return Customer.fromPersistence(
      customerData.id,
      customerData.storeId,
      customerData.personId,
      customerData.status as EntityStatus,
      customerData.registeredAt,
      customerData.updatedAt,
    );
  }

  async update(customer: Customer): Promise<Customer> {
    const customerData = await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        status: customer.status,
        updatedAt: customer.updatedAt,
      },
    });

    return Customer.fromPersistence(
      customerData.id,
      customerData.storeId,
      customerData.personId,
      customerData.status as EntityStatus,
      customerData.registeredAt,
      customerData.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.update({
      where: { id },
      data: { status: EntityStatus.DELETED },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.customer.count({
      where: { id },
    });
    return count > 0;
  }

  async count(filters?: CustomerQueryFilters): Promise<number> {
    const where: any = {};

    if (filters?.storeId) {
      where.storeId = filters.storeId;
    }

    if (filters?.personId) {
      where.personId = filters.personId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { id: { contains: filters.search, mode: 'insensitive' } },
        { storeId: { contains: filters.search, mode: 'insensitive' } },
        { personId: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.customer.count({ where });
  }
}
