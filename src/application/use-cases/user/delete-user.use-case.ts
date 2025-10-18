import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserNotFoundError, UserDeletedError } from '../../errors/domain-errors';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    // 1. Buscar usuario existente
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new UserNotFoundError(id);
    }

    // 2. Verificar que no esté ya eliminado
    if (existingUser.isDeleted()) {
      throw new UserDeletedError(id);
    }

    // 3. Aplicar soft delete (cambiar estado a DELETED)
    const deletedUser = existingUser.changeStatus(EntityStatus.DELETED);

    // 4. Guardar cambios
    await this.userRepository.update(deletedUser);
  }
}
