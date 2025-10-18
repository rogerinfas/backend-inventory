import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import type { PersonRepository, SupplierRepository, StoreRepository } from '../../../domain/repositories';
import { CreateSupplierWithPersonDto } from '../../dto/supplier/create-supplier-with-person.dto';
import { SupplierWithPersonResponseDto } from '../../dto/supplier/supplier-with-person-response.dto';
import { Person } from '../../../domain/entities/person.entity';
import { Supplier } from '../../../domain/entities/supplier.entity';
import { SupplierMapper } from '../../mappers/supplier.mapper';
import { 
  PersonAlreadyExistsError, 
  SupplierAlreadyExistsError,
  StoreNotFoundError
} from '../../errors/domain-errors';
import { DocumentType } from '../../../domain/enums/document-type.enum';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';
import * as crypto from 'crypto';

@Injectable()
export class CreateSupplierWithPersonUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly supplierRepository: SupplierRepository,
    private readonly storeRepository: StoreRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(dto: CreateSupplierWithPersonDto): Promise<SupplierWithPersonResponseDto> {
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

      // 3. Verificar que no exista Supplier para esta tienda y documento
      const existingSupplier = await this.supplierRepository.findByStoreAndDocument(
        dto.storeId,
        dto.documentNumber,
        tx
      );
      
      if (existingSupplier) {
        throw new SupplierAlreadyExistsError(dto.storeId, dto.documentNumber);
      }

      // 4. Crear Person
      const personId = crypto.randomUUID();
      const person = Person.create(
        personId,
        dto.documentType,
        dto.documentNumber,
        dto.names,
        dto.legalName,
        dto.address,
        dto.phone,
        dto.email
      );

      const savedPerson = await this.personRepository.createWithTransaction(person, tx);

      // 5. Crear Supplier
      const supplierId = crypto.randomUUID();
      const supplier = Supplier.create(
        supplierId,
        dto.storeId,
        savedPerson.id
      );

      const savedSupplier = await this.supplierRepository.createWithTransaction(supplier, tx);

      // 6. Retornar DTO de respuesta con datos de Person incluidos
      return SupplierMapper.toResponseDtoWithPerson(savedSupplier, savedPerson);
    });
  }
}
