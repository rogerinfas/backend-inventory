import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { PersonRepository } from '../../domain/repositories/person.repository';
import { User } from '../../domain/entities/user.entity';
import { Person } from '../../domain/entities/person.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { DocumentType } from '../../domain/enums/document-type.enum';
import { EntityStatus } from '../../domain/enums/entity-status.enum';
import * as bcrypt from 'bcrypt';

export interface CreateGeneralAdminRequest {
  email: string;
  password: string;
  documentNumber: string;
  names: string;
  legalName?: string;
  phone?: string;
  address?: string;
}

export interface CreateGeneralAdminResponse {
  success: boolean;
  message: string;
  adminId?: string;
}

@Injectable()
export class CreateGeneralAdminUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('PersonRepository')
    private readonly personRepository: PersonRepository,
  ) {}

  async execute(request: CreateGeneralAdminRequest): Promise<CreateGeneralAdminResponse> {
    try {
      // Verificar si ya existe un admin general
      const existingAdmin = await this.userRepository.findByEmail(request.email);
      if (existingAdmin) {
        return {
          success: false,
          message: 'Ya existe un usuario con este email',
        };
      }

      // Verificar si ya existe una persona con este documento
      const existingPerson = await this.personRepository.findByDocumentNumber(request.documentNumber);
      if (existingPerson) {
        return {
          success: false,
          message: 'Ya existe una persona con este número de documento',
        };
      }

      // Crear la persona
      const person = Person.create(
        crypto.randomUUID(),
        DocumentType.DNI,
        request.documentNumber,
        request.names,
        request.phone,
      );

      await this.personRepository.save(person);

      // Hashear la contraseña
      const passwordHash = await bcrypt.hash(request.password, 10);

      // Crear el usuario admin general (sin storeId)
      const adminUser = User.create(
        crypto.randomUUID(),
        null, // storeId es null para admin general
        person.id,
        request.email,
        passwordHash,
        UserRole.ADMIN,
      );

      await this.userRepository.save(adminUser);

      return {
        success: true,
        message: 'Administrador general creado exitosamente',
        adminId: adminUser.id,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al crear administrador general: ${error.message}`,
      };
    }
  }
}
