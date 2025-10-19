import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Brand } from '../../domain/entities/brand.entity';
import { BrandRepository, BrandQueryFilters } from '../../domain/repositories/brand.repository';
import { EntityStatus } from '../../domain/enums/entity-status.enum';

@Injectable()
export class BrandPrismaRepository implements BrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Brand | null> {
    const brandData = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brandData) {
      return null;
    }

    return Brand.fromPersistence(
      brandData.id,
      brandData.name,
      brandData.status as EntityStatus,
      brandData.createdAt,
      brandData.updatedAt
    );
  }

  async findByName(name: string): Promise<Brand | null> {
    const brandData = await this.prisma.brand.findFirst({
      where: { 
        name: {
          equals: name,
          mode: 'insensitive'
        }
      },
    });

    if (!brandData) {
      return null;
    }

    return Brand.fromPersistence(
      brandData.id,
      brandData.name,
      brandData.status as EntityStatus,
      brandData.createdAt,
      brandData.updatedAt
    );
  }

  async findMany(filters: BrandQueryFilters): Promise<Brand[]> {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.name = {
        contains: filters.search,
        mode: 'insensitive'
      };
    }

    const brandsData = await this.prisma.brand.findMany({
      where,
      skip: filters.offset || 0,
      take: filters.limit || 10,
      orderBy: {
        [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc',
      },
    });

    return brandsData.map(brandData =>
      Brand.fromPersistence(
        brandData.id,
        brandData.name,
        brandData.status as EntityStatus,
        brandData.createdAt,
        brandData.updatedAt
      )
    );
  }

  async save(brand: Brand): Promise<Brand> {
    const brandData = await this.prisma.brand.create({
      data: {
        id: brand.id,
        name: brand.name,
        status: brand.status,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt,
      },
    });

    return Brand.fromPersistence(
      brandData.id,
      brandData.name,
      brandData.status as EntityStatus,
      brandData.createdAt,
      brandData.updatedAt
    );
  }

  async update(brand: Brand): Promise<Brand> {
    const brandData = await this.prisma.brand.update({
      where: { id: brand.id },
      data: {
        name: brand.name,
        status: brand.status,
        updatedAt: brand.updatedAt,
      },
    });

    return Brand.fromPersistence(
      brandData.id,
      brandData.name,
      brandData.status as EntityStatus,
      brandData.createdAt,
      brandData.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.brand.update({
      where: { id },
      data: { status: EntityStatus.DELETED },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.brand.count({
      where: { id },
    });
    return count > 0;
  }

  async count(filters: BrandQueryFilters): Promise<number> {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.name = {
        contains: filters.search,
        mode: 'insensitive'
      };
    }

    return this.prisma.brand.count({ where });
  }
}
