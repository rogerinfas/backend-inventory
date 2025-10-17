import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PersonRepository } from '../../domain/repositories';
import { Person } from '../../domain/entities/person.entity';
import { DocumentType } from '../../domain/enums/document-type.enum';
import { EntityStatus } from '../../domain/enums/entity-status.enum';
import { PersonQueryDto } from '../../application/dto/person';

@Injectable()
export class PersonPrismaRepository implements PersonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Person | null> {
    const personData = await this.prisma.person.findUnique({
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
      personData.legalName,
      personData.address,
      personData.phone,
      personData.email,
      personData.status as EntityStatus,
      personData.createdAt,
      personData.updatedAt
    );
  }

  async findByDocumentNumber(documentNumber: string): Promise<Person | null> {
    const personData = await this.prisma.person.findUnique({
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
      personData.legalName,
      personData.address,
      personData.phone,
      personData.email,
      personData.status as EntityStatus,
      personData.createdAt,
      personData.updatedAt
    );
  }

  async findByEmail(email: string): Promise<Person | null> {
    const personData = await this.prisma.person.findFirst({
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
      personData.legalName,
      personData.address,
      personData.phone,
      personData.email,
      personData.status as EntityStatus,
      personData.createdAt,
      personData.updatedAt
    );
  }

  async findMany(filters: PersonQueryDto): Promise<Person[]> {
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

    const personsData = await this.prisma.person.findMany({
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
        personData.legalName,
        personData.address,
        personData.phone,
        personData.email,
        personData.status as EntityStatus,
        personData.createdAt,
        personData.updatedAt
      )
    );
  }

  async save(person: Person): Promise<Person> {
    const personData = await this.prisma.person.create({
      data: {
        id: person.id,
        documentType: person.document.type,
        documentNumber: person.document.number,
        names: person.names,
        legalName: person.legalName,
        address: person.address,
        phone: person.phone?.value || null,
        email: person.email?.value || null,
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
      personData.legalName,
      personData.address,
      personData.phone,
      personData.email,
      personData.status as EntityStatus,
      personData.createdAt,
      personData.updatedAt
    );
  }

  async update(person: Person): Promise<Person> {
    const personData = await this.prisma.person.update({
      where: { id: person.id },
      data: {
        names: person.names,
        legalName: person.legalName,
        address: person.address,
        phone: person.phone?.value || null,
        email: person.email?.value || null,
        status: person.status,
        updatedAt: person.updatedAt,
      },
    });

    return Person.fromPersistence(
      personData.id,
      personData.documentType as DocumentType,
      personData.documentNumber,
      personData.names,
      personData.legalName,
      personData.address,
      personData.phone,
      personData.email,
      personData.status as EntityStatus,
      personData.createdAt,
      personData.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.person.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.person.count({
      where: { id },
    });
    return count > 0;
  }

  async count(filters: Partial<PersonQueryDto>): Promise<number> {
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

    return this.prisma.person.count({ where });
  }
}
