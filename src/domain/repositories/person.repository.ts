import { Person } from '../entities/person.entity';
import { DocumentType } from '../enums/document-type.enum';
import { EntityStatus } from '../enums/entity-status.enum';

/**
 * Interfaz del repositorio de Personas
 */
export interface PersonRepository {
  findById(id: string): Promise<Person | null>;
  findByDocumentNumber(documentNumber: string): Promise<Person | null>;
  findByEmail(email: string): Promise<Person | null>;
  findMany(filters?: {
    documentType?: DocumentType;
    status?: EntityStatus;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Person[]>;
  save(person: Person): Promise<Person>;
  update(person: Person): Promise<Person>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(filters?: {
    documentType?: DocumentType;
    status?: EntityStatus;
    search?: string;
  }): Promise<number>;
}
