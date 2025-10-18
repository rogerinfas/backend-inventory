import { Customer } from '../../domain/entities/customer.entity';
import { Person } from '../../domain/entities/person.entity';
import { CreateCustomerDto, CustomerResponseDto, CustomerQueryDto, CustomerWithPersonResponseDto, CustomerPersonDataDto } from '../dto/customer';
import { CustomerQueryFilters } from '../../domain/repositories/customer.repository';

export class CustomerMapper {
  // DTO → Entidad
  static toDomain(dto: CreateCustomerDto, id: string): Customer {
    return Customer.create(
      id,
      dto.storeId,
      dto.personId,
    );
  }

  // Entidad → DTO de respuesta
  static toResponseDto(customer: Customer): CustomerResponseDto {
    return {
      id: customer.id,
      storeId: customer.storeId,
      personId: customer.personId,
      status: customer.status,
      registeredAt: customer.registeredAt,
      updatedAt: customer.updatedAt,
    };
  }

  // DTO de consulta → Filtros de repositorio
  static toQueryFilters(dto: CustomerQueryDto): CustomerQueryFilters {
    return {
      storeId: dto.storeId,
      personId: dto.personId,
      status: dto.status,
      search: dto.search,
      limit: dto.limit,
      offset: dto.page ? (dto.page - 1) * (dto.limit || 10) : undefined,
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
    };
  }

  // Múltiples entidades → DTOs de respuesta
  static toResponseDtoList(customers: Customer[]): CustomerResponseDto[] {
    return customers.map(customer => this.toResponseDto(customer));
  }

  // Entidad + Person → DTO de respuesta con datos de Person
  static toResponseDtoWithPerson(customer: Customer, person: Person): CustomerWithPersonResponseDto {
    const personData: CustomerPersonDataDto = {
      id: person.id,
      documentType: person.document.type,
      documentNumber: person.document.number,
      names: person.names,
      legalName: person.legalName || undefined,
      address: person.address || undefined,
      phone: person.phone?.value,
      email: person.email?.value,
      status: person.status,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
    };

    return {
      id: customer.id,
      storeId: customer.storeId,
      personId: customer.personId,
      status: customer.status,
      registeredAt: customer.registeredAt,
      updatedAt: customer.updatedAt,
      person: personData,
    };
  }
}
