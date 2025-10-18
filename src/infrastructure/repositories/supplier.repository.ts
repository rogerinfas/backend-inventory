import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SupplierRepository, SupplierQueryFilters } from '../../domain/repositories/supplier.repository';
import { PrismaTransaction } from '../../domain/repositories';
import { Supplier } from '../../domain/entities/supplier.entity';
import { EntityStatus } from '../../domain/enums/entity-status.enum';

@Injectable()
export class SupplierPrismaRepository implements SupplierRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, tx?: PrismaTransaction): Promise<Supplier | null> {
    const prisma = tx || this.prisma;
    const supplierData = await prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplierData) {
      return null;
    }

    return Supplier.fromPersistence(
      supplierData.id,
      supplierData.storeId,
      supplierData.personId,
      supplierData.status as EntityStatus,
      supplierData.createdAt,
      supplierData.updatedAt,
    );
  }

  async findByStoreId(storeId: string, tx?: PrismaTransaction): Promise<Supplier[]> {
    const prisma = tx || this.prisma;
    const suppliersData = await prisma.supplier.findMany({
      where: { storeId },
    });

    return suppliersData.map(supplierData =>
      Supplier.fromPersistence(
        supplierData.id,
        supplierData.storeId,
        supplierData.personId,
        supplierData.status as EntityStatus,
        supplierData.createdAt,
        supplierData.updatedAt,
      )
    );
  }

  async findByPersonId(personId: string, tx?: PrismaTransaction): Promise<Supplier | null> {
    const prisma = tx || this.prisma;
    const supplierData = await prisma.supplier.findFirst({
      where: { personId },
    });

    if (!supplierData) {
      return null;
    }

    return Supplier.fromPersistence(
      supplierData.id,
      supplierData.storeId,
      supplierData.personId,
      supplierData.status as EntityStatus,
      supplierData.createdAt,
      supplierData.updatedAt,
    );
  }

  async findByStoreAndPerson(storeId: string, personId: string, tx?: PrismaTransaction): Promise<Supplier | null> {
    const prisma = tx || this.prisma;
    const supplierData = await prisma.supplier.findFirst({
      where: {
        storeId,
        personId,
      },
    });

    if (!supplierData) {
      return null;
    }

    return Supplier.fromPersistence(
      supplierData.id,
      supplierData.storeId,
      supplierData.personId,
      supplierData.status as EntityStatus,
      supplierData.createdAt,
      supplierData.updatedAt,
    );
  }

  async findByStoreAndDocument(storeId: string, documentNumber: string, tx?: PrismaTransaction): Promise<Supplier | null> {
    const prisma = tx || this.prisma;
    const supplierData = await prisma.supplier.findFirst({
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

    if (!supplierData) {
      return null;
    }

    return Supplier.fromPersistence(
      supplierData.id,
      supplierData.storeId,
      supplierData.personId,
      supplierData.status as EntityStatus,
      supplierData.createdAt,
      supplierData.updatedAt,
    );
  }

  async findMany(filters?: SupplierQueryFilters, tx?: PrismaTransaction): Promise<Supplier[]> {
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
    const suppliersData = await prisma.supplier.findMany({
      where,
      skip: filters?.offset || 0,
      take: filters?.limit || 10,
      orderBy: {
        [filters?.sortBy || 'createdAt']: filters?.sortOrder || 'desc',
      },
    });

    return suppliersData.map(supplierData =>
      Supplier.fromPersistence(
        supplierData.id,
        supplierData.storeId,
        supplierData.personId,
        supplierData.status as EntityStatus,
        supplierData.createdAt,
        supplierData.updatedAt,
      )
    );
  }

  async save(supplier: Supplier, tx?: PrismaTransaction): Promise<Supplier> {
    const prisma = tx || this.prisma;
    const supplierData = await prisma.supplier.create({
      data: {
        id: supplier.id,
        storeId: supplier.storeId,
        personId: supplier.personId,
        status: supplier.status,
        createdAt: supplier.createdAt,
        updatedAt: supplier.updatedAt,
      },
    });

    return Supplier.fromPersistence(
      supplierData.id,
      supplierData.storeId,
      supplierData.personId,
      supplierData.status as EntityStatus,
      supplierData.createdAt,
      supplierData.updatedAt,
    );
  }

  async createWithTransaction(supplier: Supplier, tx?: PrismaTransaction): Promise<Supplier> {
    const prisma = tx || this.prisma;
    const supplierData = await prisma.supplier.create({
      data: {
        id: supplier.id,
        storeId: supplier.storeId,
        personId: supplier.personId,
        status: supplier.status,
        createdAt: supplier.createdAt,
        updatedAt: supplier.updatedAt,
      },
    });

    return Supplier.fromPersistence(
      supplierData.id,
      supplierData.storeId,
      supplierData.personId,
      supplierData.status as EntityStatus,
      supplierData.createdAt,
      supplierData.updatedAt,
    );
  }

  async update(supplier: Supplier, tx?: PrismaTransaction): Promise<Supplier> {
    const prisma = tx || this.prisma;
    const supplierData = await prisma.supplier.update({
      where: { id: supplier.id },
      data: {
        status: supplier.status,
        updatedAt: supplier.updatedAt,
      },
    });

    return Supplier.fromPersistence(
      supplierData.id,
      supplierData.storeId,
      supplierData.personId,
      supplierData.status as EntityStatus,
      supplierData.createdAt,
      supplierData.updatedAt,
    );
  }

  async delete(id: string, tx?: PrismaTransaction): Promise<void> {
    const prisma = tx || this.prisma;
    await prisma.supplier.update({
      where: { id },
      data: { status: EntityStatus.DELETED },
    });
  }

  async exists(id: string, tx?: PrismaTransaction): Promise<boolean> {
    const prisma = tx || this.prisma;
    const count = await prisma.supplier.count({
      where: { id },
    });
    return count > 0;
  }

  async count(filters?: SupplierQueryFilters, tx?: PrismaTransaction): Promise<number> {
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
    return prisma.supplier.count({ where });
  }
}
