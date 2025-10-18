import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CustomerRepository, CustomerQueryFilters } from '../../domain/repositories/customer.repository';
import { PrismaTransaction } from '../../domain/repositories';
import { Customer } from '../../domain/entities/customer.entity';
import { EntityStatus } from '../../domain/enums/entity-status.enum';

@Injectable()
export class CustomerPrismaRepository implements CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, tx?: PrismaTransaction): Promise<Customer | null> {
    const prisma = tx || this.prisma;
    const customerData = await prisma.customer.findUnique({
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

  async findByStoreId(storeId: string, tx?: PrismaTransaction): Promise<Customer[]> {
    const prisma = tx || this.prisma;
    const customersData = await prisma.customer.findMany({
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

  async findByPersonId(personId: string, tx?: PrismaTransaction): Promise<Customer | null> {
    const prisma = tx || this.prisma;
    const customerData = await prisma.customer.findFirst({
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

  async findByStoreAndPerson(storeId: string, personId: string, tx?: PrismaTransaction): Promise<Customer | null> {
    const prisma = tx || this.prisma;
    const customerData = await prisma.customer.findFirst({
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

  async findByStoreAndDocument(storeId: string, documentNumber: string, tx?: PrismaTransaction): Promise<Customer | null> {
    const prisma = tx || this.prisma;
    const customerData = await prisma.customer.findFirst({
      where: {
        storeId,
        person: {
          documentNumber
        }
      },
      include: {
        person: true
      }
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

  async findMany(filters?: CustomerQueryFilters, tx?: PrismaTransaction): Promise<Customer[]> {
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

    const prisma = tx || this.prisma;
    const customersData = await prisma.customer.findMany({
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

  async save(customer: Customer, tx?: PrismaTransaction): Promise<Customer> {
    const prisma = tx || this.prisma;
    const customerData = await prisma.customer.create({
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

  async createWithTransaction(customer: Customer, tx?: PrismaTransaction): Promise<Customer> {
    const prisma = tx || this.prisma;
    const customerData = await prisma.customer.create({
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

  async update(customer: Customer, tx?: PrismaTransaction): Promise<Customer> {
    const prisma = tx || this.prisma;
    const customerData = await prisma.customer.update({
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

  async delete(id: string, tx?: PrismaTransaction): Promise<void> {
    const prisma = tx || this.prisma;
    await prisma.customer.update({
      where: { id },
      data: { status: EntityStatus.DELETED },
    });
  }

  async exists(id: string, tx?: PrismaTransaction): Promise<boolean> {
    const prisma = tx || this.prisma;
    const count = await prisma.customer.count({
      where: { id },
    });
    return count > 0;
  }

  async count(filters?: CustomerQueryFilters, tx?: PrismaTransaction): Promise<number> {
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

    const prisma = tx || this.prisma;
    return prisma.customer.count({ where });
  }
}
