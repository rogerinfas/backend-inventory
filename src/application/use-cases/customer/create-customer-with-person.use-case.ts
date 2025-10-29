import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import type { PersonRepository, CustomerRepository, StoreRepository } from '../../../domain/repositories';
import { CreateCustomerWithPersonDto } from '../../dto/customer/create-customer-with-person.dto';
import { CustomerWithPersonResponseDto } from '../../dto/customer/customer-with-person-response.dto';
import { Person } from '../../../domain/entities/person.entity';
import { Customer } from '../../../domain/entities/customer.entity';
import { CustomerMapper } from '../../mappers/customer.mapper';
import { 
  PersonAlreadyExistsError, 
  CustomerAlreadyExistsError,
  StoreNotFoundError
} from '../../errors/domain-errors';
import { DocumentType } from '../../../domain/enums/document-type.enum';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';
import * as crypto from 'crypto';

@Injectable()
export class CreateCustomerWithPersonUseCase {
  constructor(
    @Inject('PersonRepository') private readonly personRepository: PersonRepository,
    @Inject('CustomerRepository') private readonly customerRepository: CustomerRepository,
    @Inject('StoreRepository') private readonly storeRepository: StoreRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(dto: CreateCustomerWithPersonDto): Promise<CustomerWithPersonResponseDto> {
    return await this.prismaService.$transaction(async (tx) => {
      // 1. Verificar que la tienda existe
      const store = await this.storeRepository.findById(dto.storeId);
      if (!store) {
        throw new StoreNotFoundError(dto.storeId);
      }

      // 2. Verificar que no exista Person con el mismo documento
      const existingPerson = await this.personRepository.findByDocumentNumber(
        dto.documentNumber,
        tx
      );
      
      if (existingPerson) {
        throw new PersonAlreadyExistsError('documentNumber', dto.documentNumber);
      }

      // 3. Verificar que no exista Customer para esta tienda y documento
      const existingCustomer = await this.customerRepository.findByStoreAndDocument(
        dto.storeId,
        dto.documentNumber,
        tx
      );
      
      if (existingCustomer) {
        throw new CustomerAlreadyExistsError(dto.storeId, dto.documentNumber);
      }

      // 4. Crear Person
      const personId = crypto.randomUUID();
      const person = Person.create(
        personId,
        dto.documentType,
        dto.documentNumber,
        dto.names,
        dto.phone
      );

      const savedPerson = await this.personRepository.createWithTransaction(person, tx);

      // 5. Crear Customer
      const customerId = crypto.randomUUID();
      const customer = Customer.create(
        customerId,
        dto.storeId,
        savedPerson.id
      );

      const savedCustomer = await this.customerRepository.createWithTransaction(customer, tx);

      // 6. Retornar DTO de respuesta con datos de Person incluidos
      return CustomerMapper.toResponseDtoWithPerson(savedCustomer, savedPerson);
    });
  }
}
