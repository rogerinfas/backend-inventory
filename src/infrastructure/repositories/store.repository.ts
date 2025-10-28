import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StoreRepository, StoreQueryFilters } from '../../domain/repositories/store.repository';
import { Store } from '../../domain/entities/store.entity';
import { EntityStatus } from '../../domain/enums/entity-status.enum';

@Injectable()
export class StorePrismaRepository implements StoreRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Store | null> {
    const storeData = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!storeData) {
      return null;
    }

    return Store.fromPersistence(
      storeData.id,
      storeData.businessName,
      storeData.ruc,
      storeData.address,
      storeData.phone,
      storeData.logoUrl,
      storeData.status as EntityStatus,
      storeData.registeredAt,
      storeData.updatedAt
    );
  }

  async findByRuc(ruc: string): Promise<Store | null> {
    const storeData = await this.prisma.store.findUnique({
      where: { ruc },
    });

    if (!storeData) {
      return null;
    }

    return Store.fromPersistence(
      storeData.id,
      storeData.businessName,
      storeData.ruc,
      storeData.address,
      storeData.phone,
      storeData.logoUrl,
      storeData.status as EntityStatus,
      storeData.registeredAt,
      storeData.updatedAt
    );
  }


  async findMany(filters?: StoreQueryFilters): Promise<Store[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { businessName: { contains: filters.search, mode: 'insensitive' } },
        { ruc: { contains: filters.search } },
      ];
    }

    const storesData = await this.prisma.store.findMany({
      where,
      skip: filters?.offset || 0,
      take: filters?.limit || 10,
      orderBy: {
        [filters?.sortBy || 'businessName']: filters?.sortOrder || 'asc',
      },
    });

    return storesData.map(storeData =>
      Store.fromPersistence(
        storeData.id,
        storeData.businessName,
        storeData.ruc,
        storeData.address,
        storeData.phone,
        storeData.logoUrl,
        storeData.status as EntityStatus,
        storeData.registeredAt,
        storeData.updatedAt
      )
    );
  }

  async save(store: Store): Promise<Store> {
    const storeData = await this.prisma.store.create({
      data: {
        id: store.id,
        businessName: store.businessName,
        ruc: store.ruc,
        address: store.address,
        phone: store.phone,
        logoUrl: store.logoUrl,
        status: store.status,
        registeredAt: store.registeredAt,
        updatedAt: store.updatedAt,
      },
    });

    return Store.fromPersistence(
      storeData.id,
      storeData.businessName,
      storeData.ruc,
      storeData.address,
      storeData.phone,
      storeData.logoUrl,
      storeData.status as EntityStatus,
      storeData.registeredAt,
      storeData.updatedAt
    );
  }

  async update(store: Store): Promise<Store> {
    const storeData = await this.prisma.store.update({
      where: { id: store.id },
      data: {
        businessName: store.businessName,
        address: store.address,
        phone: store.phone,
        logoUrl: store.logoUrl,
        status: store.status,
        updatedAt: store.updatedAt,
      },
    });

    return Store.fromPersistence(
      storeData.id,
      storeData.businessName,
      storeData.ruc,
      storeData.address,
      storeData.phone,
      storeData.logoUrl,
      storeData.status as EntityStatus,
      storeData.registeredAt,
      storeData.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.store.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.store.count({
      where: { id },
    });
    return count > 0;
  }

  async count(filters?: StoreQueryFilters): Promise<number> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { businessName: { contains: filters.search, mode: 'insensitive' } },
        { ruc: { contains: filters.search } },
      ];
    }

    return this.prisma.store.count({ where });
  }

  async countByStatus(status: EntityStatus): Promise<number> {
    return this.prisma.store.count({
      where: { status },
    });
  }
}
