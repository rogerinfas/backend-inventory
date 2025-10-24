import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import type { PersonRepository, UserRepository, StoreRepository } from '../../../domain/repositories';
import { CreateUserWithPersonDto } from '../../dto/user/create-user-with-person.dto';
import { UserWithPersonResponseDto } from '../../dto/user/user-with-person-response.dto';
import { Person } from '../../../domain/entities/person.entity';
import { User } from '../../../domain/entities/user.entity';
import { UserMapper } from '../../mappers/user.mapper';
import { 
  PersonAlreadyExistsError, 
  UserAlreadyExistsError,
  StoreNotFoundError
} from '../../errors/domain-errors';
import { DocumentType } from '../../../domain/enums/document-type.enum';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserWithPersonUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly userRepository: UserRepository,
    private readonly storeRepository: StoreRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(dto: CreateUserWithPersonDto): Promise<UserWithPersonResponseDto> {
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

      // 3. Verificar que no exista User con el mismo email
      const existingUser = await this.userRepository.findByEmail(dto.email, tx);
      
      if (existingUser) {
        throw new UserAlreadyExistsError('email', dto.email);
      }

      // 4. Verificar que no exista User para esta tienda y email
      const existingUserByStore = await this.userRepository.findByStoreAndEmail(
        dto.storeId,
        dto.email,
        tx
      );
      
      if (existingUserByStore) {
        throw new UserAlreadyExistsError('email', dto.email);
      }

      // 5. Crear Person
      const personId = crypto.randomUUID();
      const person = Person.create(
        personId,
        dto.documentType,
        dto.documentNumber,
        dto.names,
        dto.phone
      );

      const savedPerson = await this.personRepository.createWithTransaction(person, tx);

      // 6. Hashear la contraseña
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(dto.password, saltRounds);

      // 7. Crear User
      const userId = crypto.randomUUID();
      const user = UserMapper.toDomainFromCreateWithPersonDto(
        dto,
        userId,
        savedPerson.id,
        passwordHash
      );

      const savedUser = await this.userRepository.createWithTransaction(user, tx);

      // 8. Retornar DTO de respuesta con datos de Person incluidos
      return UserMapper.toResponseDtoWithPerson(savedUser, savedPerson);
    });
  }
}
