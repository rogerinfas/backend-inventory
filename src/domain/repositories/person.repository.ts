import { Person } from '../entities/person.entity';
import { DocumentType } from '../enums/document-type.enum';
import { EntityStatus } from '../enums/entity-status.enum';

// Tipo para transacciones Prisma
export type PrismaTransaction = any;

/**
 * Interfaz del repositorio de Personas
 */
export interface PersonRepository {
  findById(id: string, tx?: PrismaTransaction): Promise<Person | null>;
  findByDocumentNumber(documentNumber: string, tx?: PrismaTransaction): Promise<Person | null>;
  findByEmail(email: string, tx?: PrismaTransaction): Promise<Person | null>;
  findMany(filters?: {
    documentType?: DocumentType;
    status?: EntityStatus;
    search?: string;
    limit?: number;
    offset?: number;
  }, tx?: PrismaTransaction): Promise<Person[]>;
  save(person: Person, tx?: PrismaTransaction): Promise<Person>;
  createWithTransaction(person: Person, tx?: PrismaTransaction): Promise<Person>;
  update(person: Person, tx?: PrismaTransaction): Promise<Person>;
  delete(id: string, tx?: PrismaTransaction): Promise<void>;
  exists(id: string, tx?: PrismaTransaction): Promise<boolean>;
  count(filters?: {
    documentType?: DocumentType;
    status?: EntityStatus;
    search?: string;
  }, tx?: PrismaTransaction): Promise<number>;
}
