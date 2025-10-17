import { Person } from '../../domain/entities/person.entity';
import { CreatePersonDto, UpdatePersonDto, PersonResponseDto, PersonQueryDto } from '../dto/person';

export class PersonMapper {
  static toDomain(dto: CreatePersonDto, id: string): Person {
    return Person.create(
      id,
      dto.documentType,
      dto.documentNumber,
      dto.names,
      dto.legalName,
      dto.address,
      dto.phone,
      dto.email
    );
  }

  static toResponseDto(person: Person): PersonResponseDto {
    return {
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
    };
  }

  static toUpdateDomain(dto: UpdatePersonDto, existingPerson: Person): Person {
    // Validar que al menos un campo esté presente para actualizar
    if (!this.validateUpdateDto(dto)) {
      throw new Error('No hay campos válidos para actualizar');
    }

    // Aplicar actualizaciones usando los métodos de la entidad
    // Los métodos de la entidad ya manejan la validación y actualización de updatedAt
    if (dto.names !== undefined) {
      existingPerson.updateNames(dto.names);
    }
    if (dto.legalName !== undefined) {
      existingPerson.updateLegalName(dto.legalName);
    }
    if (dto.address !== undefined) {
      existingPerson.updateAddress(dto.address);
    }
    if (dto.phone !== undefined) {
      existingPerson.updatePhone(dto.phone);
    }
    if (dto.email !== undefined) {
      existingPerson.updateEmail(dto.email);
    }

    // Retornar la entidad actualizada
    // Nota: La entidad Person está diseñada para ser mutada a través de sus métodos
    // ya que encapsula la lógica de negocio y actualiza automáticamente updatedAt
    return existingPerson;
  }

  static toQueryFilters(dto: PersonQueryDto) {
    return {
      documentType: dto.documentType,
      status: dto.status,
      search: dto.search,
      limit: dto.limit || 10,
      offset: dto.page ? (dto.page - 1) * (dto.limit || 10) : 0,
      sortBy: dto.sortBy || 'createdAt',
      sortOrder: dto.sortOrder || 'desc',
    };
  }

  /**
   * Convierte una entidad Person a un DTO de actualización
   * Útil para pre-poblar formularios de edición
   */
  static toUpdateDto(person: Person): Partial<UpdatePersonDto> {
    return {
      names: person.names,
      legalName: person.legalName || undefined,
      address: person.address || undefined,
      phone: person.phone?.value || undefined,
      email: person.email?.value || undefined,
    };
  }

  /**
   * Valida que un DTO de actualización tenga al menos un campo válido
   */
  static validateUpdateDto(dto: UpdatePersonDto): boolean {
    const fields = Object.keys(dto) as (keyof UpdatePersonDto)[];
    return fields.some(field => {
      const value = dto[field];
      return value !== undefined && value !== null && value !== '';
    });
  }

  /**
   * Convierte datos de persistencia a entidad de dominio
   * Útil para repositorios que necesitan reconstruir entidades
   */
  static fromPersistence(data: {
    id: string;
    documentType: string;
    documentNumber: string;
    names: string;
    legalName: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): Person {
    return Person.fromPersistence(
      data.id,
      data.documentType as any, // El enum se valida en la entidad
      data.documentNumber,
      data.names,
      data.legalName,
      data.address,
      data.phone,
      data.email,
      data.status as any, // El enum se valida en la entidad
      data.createdAt,
      data.updatedAt
    );
  }
}
