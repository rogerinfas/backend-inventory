import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository, CategoryQueryFilters } from '../../domain/repositories/category.repository';
import { EntityStatus } from '../../domain/enums/entity-status.enum';

@Injectable()
export class CategoryPrismaRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Category | null> {
    const categoryData = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!categoryData) {
      return null;
    }

    return Category.fromPersistence(
      categoryData.id,
      categoryData.name,
      categoryData.description,
      categoryData.status as EntityStatus,
      categoryData.createdAt,
      categoryData.updatedAt
    );
  }

  async findByName(name: string): Promise<Category | null> {
    const categoryData = await this.prisma.category.findFirst({
      where: { 
        name: {
          equals: name,
          mode: 'insensitive'
        }
      },
    });

    if (!categoryData) {
      return null;
    }

    return Category.fromPersistence(
      categoryData.id,
      categoryData.name,
      categoryData.description,
      categoryData.status as EntityStatus,
      categoryData.createdAt,
      categoryData.updatedAt
    );
  }

  async findMany(filters: CategoryQueryFilters): Promise<Category[]> {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const categoriesData = await this.prisma.category.findMany({
      where,
      skip: filters.offset || 0,
      take: filters.limit || 10,
      orderBy: {
        [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc',
      },
    });

    return categoriesData.map(categoryData =>
      Category.fromPersistence(
        categoryData.id,
        categoryData.name,
        categoryData.description,
        categoryData.status as EntityStatus,
        categoryData.createdAt,
        categoryData.updatedAt
      )
    );
  }

  async save(category: Category): Promise<Category> {
    const categoryData = await this.prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
        status: category.status,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });

    return Category.fromPersistence(
      categoryData.id,
      categoryData.name,
      categoryData.description,
      categoryData.status as EntityStatus,
      categoryData.createdAt,
      categoryData.updatedAt
    );
  }

  async update(category: Category): Promise<Category> {
    const categoryData = await this.prisma.category.update({
      where: { id: category.id },
      data: {
        name: category.name,
        description: category.description,
        status: category.status,
        updatedAt: category.updatedAt,
      },
    });

    return Category.fromPersistence(
      categoryData.id,
      categoryData.name,
      categoryData.description,
      categoryData.status as EntityStatus,
      categoryData.createdAt,
      categoryData.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.update({
      where: { id },
      data: { status: EntityStatus.DELETED },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.category.count({
      where: { id },
    });
    return count > 0;
  }

  async count(filters: CategoryQueryFilters): Promise<number> {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.category.count({ where });
  }
}
