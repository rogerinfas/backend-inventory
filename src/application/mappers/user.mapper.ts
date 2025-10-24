import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { EntityStatus } from '../../domain/enums/entity-status.enum';
import { Person } from '../../domain/entities/person.entity';
import { 
  CreateUserDto, 
  CreateUserWithPersonDto,
  UserResponseDto, 
  UserWithPersonResponseDto,
  UserPersonDataDto,
  UpdateUserDto 
} from '../dto/user';

export class UserMapper {
  /**
   * Convierte DTO de creación a entidad de dominio
   */
  static toDomain(dto: CreateUserDto, id: string, passwordHash: string): User {
    return User.create(
      id,
      dto.storeId,
      dto.personId,
      dto.email,
      passwordHash,
      UserRole.SELLER // Rol por defecto para seguridad
    );
  }

  /**
   * Convierte DTO de creación con persona a entidad de dominio (solo User)
   */
  static toDomainFromCreateWithPersonDto(
    dto: CreateUserWithPersonDto,
    userId: string,
    personId: string,
    passwordHash: string,
  ): User {
    return User.create(
      userId,
      dto.storeId,
      personId,
      dto.email,
      passwordHash,
      UserRole.SELLER // Rol por defecto para seguridad
    );
  }

  /**
   * Convierte entidad de dominio a DTO de respuesta
   */
  static toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      storeId: user.storeId || undefined,
      personId: user.personId,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLoginAt: user.lastLoginAt || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Convierte entidad de dominio a DTO de respuesta enriquecido con datos de Person
   */
  static toResponseDtoWithPerson(user: User, person: Person): UserWithPersonResponseDto {
    const userResponse = this.toResponseDto(user);
    
    const personData: UserPersonDataDto = {
      id: person.id,
      documentType: person.document.type,
      documentNumber: person.document.number,
      names: person.names,
      phone: person.phone?.value || '',
      status: person.status,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
    };

    return {
      ...userResponse,
      person: personData,
    };
  }

  /**
   * Aplica actualizaciones a una entidad existente
   */
  static applyUpdates(user: User, dto: UpdateUserDto): User {
    let updatedUser = user;

    if (dto.role !== undefined) {
      updatedUser = updatedUser.changeRole(dto.role);
    }

    if (dto.status !== undefined) {
      updatedUser = updatedUser.changeStatus(dto.status);
    }

    if (dto.password !== undefined) {
      // En un caso real, aquí se hashearía la contraseña
      // Por ahora asumimos que ya viene hasheada
      updatedUser = updatedUser.updatePassword(dto.password);
    }

    return updatedUser;
  }

  /**
   * Aplica cambio de estado
   */
  static applyStatusChange(user: User, newStatus: EntityStatus): User {
    return user.changeStatus(newStatus);
  }

  /**
   * Aplica actualización de último login
   */
  static applyLastLoginUpdate(user: User): User {
    return user.updateLastLogin();
  }
}
