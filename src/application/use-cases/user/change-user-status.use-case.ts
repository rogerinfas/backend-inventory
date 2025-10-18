import { UserRepository } from '../../../domain/repositories/user.repository';
import { ChangeUserStatusDto, UserResponseDto } from '../../dto/user';
import { UserMapper } from '../../mappers/user.mapper';
import { UserNotFoundError, UserDeletedError, InvalidStatusChangeError } from '../../errors/domain-errors';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class ChangeUserStatusUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, dto: ChangeUserStatusDto): Promise<UserResponseDto> {
    // 1. Buscar usuario existente
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new UserNotFoundError(id);
    }

    // 2. Verificar que no esté eliminado
    if (existingUser.isDeleted()) {
      throw new UserDeletedError(id);
    }

    // 3. Validar cambio de estado
    this.validateStatusChange(existingUser.status, dto.status);

    // 4. Aplicar cambio de estado
    const updatedUser = UserMapper.applyStatusChange(existingUser, dto.status);

    // 5. Guardar y retornar
    const savedUser = await this.userRepository.update(updatedUser);
    return UserMapper.toResponseDto(savedUser);
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
