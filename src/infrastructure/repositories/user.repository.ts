import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UserRepository, UserQueryFilters } from '../../domain/repositories/user.repository';
import { PrismaTransaction } from '../../domain/repositories';
import { User } from '../../domain/entities/user.entity';
import { Person } from '../../domain/entities/person.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { EntityStatus } from '../../domain/enums/entity-status.enum';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, tx?: PrismaTransaction): Promise<User | null> {
    const client = tx || this.prisma;
    const userData = await client.user.findUnique({
      where: { id },
    });

    if (!userData) {
      return null;
    }

    return User.fromPersistence(
      userData.id,
      userData.storeId,
      userData.personId,
      userData.email,
      userData.passwordHash,
      userData.role as UserRole,
      userData.status as EntityStatus,
      userData.lastLoginAt,
      userData.createdAt,
      userData.updatedAt
    );
  }

  async findByEmail(email: string, tx?: PrismaTransaction): Promise<User | null> {
    const client = tx || this.prisma;
    const userData = await client.user.findUnique({
      where: { email },
    });

    if (!userData) {
      return null;
    }

    return User.fromPersistence(
      userData.id,
      userData.storeId,
      userData.personId,
      userData.email,
      userData.passwordHash,
      userData.role as UserRole,
      userData.status as EntityStatus,
      userData.lastLoginAt,
      userData.createdAt,
      userData.updatedAt
    );
  }

  async findByStoreAndEmail(storeId: string, email: string, tx?: PrismaTransaction): Promise<User | null> {
    const client = tx || this.prisma;
    const userData = await client.user.findFirst({
      where: { 
        storeId,
        email 
      },
    });

    if (!userData) {
      return null;
    }

    return User.fromPersistence(
      userData.id,
      userData.storeId,
      userData.personId,
      userData.email,
      userData.passwordHash,
      userData.role as UserRole,
      userData.status as EntityStatus,
      userData.lastLoginAt,
      userData.createdAt,
      userData.updatedAt
    );
  }

  async findByStoreAndDocument(storeId: string, documentNumber: string, tx?: PrismaTransaction): Promise<User | null> {
    const client = tx || this.prisma;
    const userData = await client.user.findFirst({
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

    if (!userData) {
      return null;
    }

    return User.fromPersistence(
      userData.id,
      userData.storeId,
      userData.personId,
      userData.email,
      userData.passwordHash,
      userData.role as UserRole,
      userData.status as EntityStatus,
      userData.lastLoginAt,
      userData.createdAt,
      userData.updatedAt
    );
  }

  async findByRole(role: UserRole, tx?: PrismaTransaction): Promise<User[]> {
    const client = tx || this.prisma;
    const usersData = await client.user.findMany({
      where: { role },
    });

    return usersData.map(userData => 
      User.fromPersistence(
        userData.id,
        userData.storeId,
        userData.personId,
        userData.email,
        userData.passwordHash,
        userData.role as UserRole,
        userData.status as EntityStatus,
        userData.lastLoginAt,
        userData.createdAt,
        userData.updatedAt
      )
    );
  }

  async findMany(filters?: UserQueryFilters, tx?: PrismaTransaction): Promise<User[]> {
    const client = tx || this.prisma;
    
    const where: any = {};
    
    if (filters?.storeId) {
      where.storeId = filters.storeId;
    }
    
    if (filters?.role) {
      where.role = filters.role;
    }
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { 
          person: {
            names: { contains: filters.search, mode: 'insensitive' }
          }
        }
      ];
    }

    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const skip = filters?.page && filters?.limit ? (filters.page - 1) * filters.limit : 0;
    const take = filters?.limit || 10;

    const usersData = await client.user.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return usersData.map(userData =>
      User.fromPersistence(
        userData.id,
        userData.storeId,
        userData.personId,
        userData.email,
        userData.passwordHash,
        userData.role as UserRole,
        userData.status as EntityStatus,
        userData.lastLoginAt,
        userData.createdAt,
        userData.updatedAt
      )
    );
  }

  async save(user: User, tx?: PrismaTransaction): Promise<User> {
    const client = tx || this.prisma;
    const userData = await client.user.create({
      data: {
        id: user.id,
        storeId: user.storeId,
        personId: user.personId,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        status: user.status,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return User.fromPersistence(
      userData.id,
      userData.storeId,
      userData.personId,
      userData.email,
      userData.passwordHash,
      userData.role as UserRole,
      userData.status as EntityStatus,
      userData.lastLoginAt,
      userData.createdAt,
      userData.updatedAt
    );
  }

  async createWithTransaction(user: User, tx?: PrismaTransaction): Promise<User> {
    return this.save(user, tx);
  }

  async update(user: User, tx?: PrismaTransaction): Promise<User> {
    const client = tx || this.prisma;
    const userData = await client.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        status: user.status,
        lastLoginAt: user.lastLoginAt,
        updatedAt: user.updatedAt,
      },
    });

    return User.fromPersistence(
      userData.id,
      userData.storeId,
      userData.personId,
      userData.email,
      userData.passwordHash,
      userData.role as UserRole,
      userData.status as EntityStatus,
      userData.lastLoginAt,
      userData.createdAt,
      userData.updatedAt
    );
  }

  async delete(id: string, tx?: PrismaTransaction): Promise<void> {
    const client = tx || this.prisma;
    await client.user.update({
      where: { id },
      data: {
        status: EntityStatus.DELETED,
        updatedAt: new Date(),
      },
    });
  }

  async exists(id: string, tx?: PrismaTransaction): Promise<boolean> {
    const client = tx || this.prisma;
    const count = await client.user.count({
      where: { id },
    });
    return count > 0;
  }

  async count(filters?: UserQueryFilters, tx?: PrismaTransaction): Promise<number> {
    const client = tx || this.prisma;
    
    const where: any = {};
    
    if (filters?.storeId) {
      where.storeId = filters.storeId;
    }
    
    if (filters?.role) {
      where.role = filters.role;
    }
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { 
          person: {
            names: { contains: filters.search, mode: 'insensitive' }
          }
        }
      ];
    }

    return client.user.count({ where });
  }

  async findPersonById(personId: string, tx?: PrismaTransaction): Promise<Person | null> {
    const client = tx || this.prisma;
    
    const personData = await client.person.findUnique({
      where: { id: personId },
    });

    if (!personData) {
      return null;
    }

    return Person.fromPersistence(
      personData.id,
      personData.documentType,
      personData.documentNumber,
      personData.names,
      personData.legalName,
      personData.address,
      personData.phone,
      personData.email,
      personData.status as EntityStatus,
      personData.createdAt,
      personData.updatedAt,
    );
  }
}
