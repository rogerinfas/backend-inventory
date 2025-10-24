import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PersonRepository, PrismaTransaction } from '../../domain/repositories';
import { Person } from '../../domain/entities/person.entity';
import { DocumentType } from '../../domain/enums/document-type.enum';
import { EntityStatus } from '../../domain/enums/entity-status.enum';
import { PersonQueryDto } from '../../application/dto/person';

@Injectable()
export class PersonPrismaRepository implements PersonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, tx?: PrismaTransaction): Promise<Person | null> {
    const prisma = tx || this.prisma;
    const personData = await prisma.person.findUnique({
      where: { id },
    });

    if (!personData) {
      return null;
    }

    return Person.fromPersistence(
      personData.id,
      personData.documentType as DocumentType,
      personData.documentNumber,
      personData.names,
      personData.phone,
      personData.status as EntityStatus,
      personData.createdAt,
      personData.updatedAt
    );
  }

  async findByDocumentNumber(documentNumber: string, tx?: PrismaTransaction): Promise<Person | null> {
    const prisma = tx || this.prisma;
    const personData = await prisma.person.findUnique({
      where: { documentNumber },
    });

    if (!personData) {
      return null;
    }

    return Person.fromPersistence(
      personData.id,
      personData.documentType as DocumentType,
      personData.documentNumber,
      personData.names,
      personData.phone,
      personData.status as EntityStatus,
      personData.createdAt,
      personData.updatedAt
    );
  }

  async findByEmail(email: string, tx?: PrismaTransaction): Promise<Person | null> {
    const prisma = tx || this.prisma;
    const personData = await prisma.person.findFirst({
      where: { email },
    });

    if (!personData) {
      return null;
    }

    return Person.fromPersistence(
      personData.id,
      personData.documentType as DocumentType,
      personData.documentNumber,
      personData.names,
      personData.phone,
      personData.status as EntityStatus,
      personData.createdAt,
      personData.updatedAt
    );
  }

  async findMany(filters: PersonQueryDto, tx?: PrismaTransaction): Promise<Person[]> {
    const where: any = {};

    if (filters.documentType) {
      where.documentType = filters.documentType;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { names: { contains: filters.search, mode: 'insensitive' } },
        { documentNumber: { contains: filters.search } },
        { legalName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const prisma = tx || this.prisma;
    const personsData = await prisma.person.findMany({
      where,
      skip: filters.offset || 0,
      take: filters.limit || 10,
      orderBy: {
        [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc',
      },
    });

    return personsData.map(personData =>
      Person.fromPersistence(
        personData.id,
        personData.documentType as DocumentType,
        personData.documentNumber,
        personData.names,
        personData.phone,
        personData.status as EntityStatus,
        personData.createdAt,
        personData.updatedAt
      )
    );
  }

  async save(person: Person, tx?: PrismaTransaction): Promise<Person> {
    const prisma = tx || this.prisma;
    const personData = await prisma.person.create({
      data: {
        id: person.id,
        documentType: person.document.type,
        documentNumber: person.document.number,
        names: person.names,
        phone: person.phone?.value || null,
        status: person.status,
        createdAt: person.createdAt,
        updatedAt: person.updatedAt,
      },
    });

    return Person.fromPersistence(
      personData.id,
      personData.documentType as DocumentType,
      personData.documentNumber,
      personData.names,
      personData.phone,
      personData.status as EntityStatus,
      personData.createdAt,
      personData.updatedAt
    );
  }

  async createWithTransaction(person: Person, tx?: PrismaTransaction): Promise<Person> {
    const prisma = tx || this.prisma;
    const personData = await prisma.person.create({
      data: {
        id: person.id,
        documentType: person.document.type,
        documentNumber: person.document.number,
        names: person.names,
        phone: person.phone?.value || null,
        status: person.status,
        createdAt: person.createdAt,
        updatedAt: person.updatedAt,
      },
    });

    return Person.fromPersistence(
      personData.id,
      personData.documentType as DocumentType,
      personData.documentNumber,
      personData.names,
      personData.phone,
      personData.status as EntityStatus,
      personData.createdAt,
      personData.updatedAt
    );
  }

  async update(person: Person, tx?: PrismaTransaction): Promise<Person> {
    const prisma = tx || this.prisma;
    const personData = await prisma.person.update({
      where: { id: person.id },
      data: {
        names: person.names,
        phone: person.phone?.value || null,
        status: person.status,
        updatedAt: person.updatedAt,
      },
    });

    return Person.fromPersistence(
      personData.id,
      personData.documentType as DocumentType,
      personData.documentNumber,
      personData.names,
      personData.phone,
      personData.status as EntityStatus,
      personData.createdAt,
      personData.updatedAt
    );
  }

  async delete(id: string, tx?: PrismaTransaction): Promise<void> {
    const prisma = tx || this.prisma;
    await prisma.person.delete({
      where: { id },
    });
  }

  async exists(id: string, tx?: PrismaTransaction): Promise<boolean> {
    const prisma = tx || this.prisma;
    const count = await prisma.person.count({
      where: { id },
    });
    return count > 0;
  }

  async count(filters: Partial<PersonQueryDto>, tx?: PrismaTransaction): Promise<number> {
    const where: any = {};

    if (filters.documentType) {
      where.documentType = filters.documentType;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { names: { contains: filters.search, mode: 'insensitive' } },
        { documentNumber: { contains: filters.search } },
        { legalName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const prisma = tx || this.prisma;
    return prisma.person.count({ where });
  }
}
