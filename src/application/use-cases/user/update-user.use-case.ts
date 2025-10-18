import { UserRepository } from '../../../domain/repositories/user.repository';
import { UpdateUserDto, UserResponseDto } from '../../dto/user';
import { UserMapper } from '../../mappers/user.mapper';
import { UserNotFoundError, UserDeletedError, InvalidStatusChangeError } from '../../errors/domain-errors';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';
import * as bcrypt from 'bcrypt';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    // 1. Buscar usuario existente
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new UserNotFoundError(id);
    }

    // 2. Verificar que no esté eliminado
    if (existingUser.isDeleted()) {
      throw new UserDeletedError(id);
    }

    // 3. Validar que hay campos para actualizar
    if (!this.validateUpdateDto(dto)) {
      throw new Error('No hay campos válidos para actualizar');
    }

    // 4. Aplicar actualizaciones
    let updatedUser = existingUser;

    if (dto.role !== undefined) {
      updatedUser = updatedUser.changeRole(dto.role);
    }

    if (dto.status !== undefined) {
      this.validateStatusChange(existingUser.status, dto.status);
      updatedUser = updatedUser.changeStatus(dto.status);
    }

    if (dto.password !== undefined) {
      // Hashear la nueva contraseña
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(dto.password, saltRounds);
      updatedUser = updatedUser.updatePassword(passwordHash);
    }

    // 5. Guardar y retornar
    const savedUser = await this.userRepository.update(updatedUser);
    return UserMapper.toResponseDto(savedUser);
  }

  private validateUpdateDto(dto: UpdateUserDto): boolean {
    return dto.role !== undefined || dto.status !== undefined || dto.password !== undefined;
  }

  private validateStatusChange(currentStatus: EntityStatus, newStatus: EntityStatus): void {
    // Reglas de negocio para cambios de estado
    if (currentStatus === EntityStatus.DELETED) {
      throw new InvalidStatusChangeError(currentStatus, newStatus);
    }

    if (currentStatus === newStatus) {
      throw new InvalidStatusChangeError(currentStatus, newStatus);
    }
  }
}
