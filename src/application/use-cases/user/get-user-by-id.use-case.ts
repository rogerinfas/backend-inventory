import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserResponseDto } from '../../dto/user';
import { UserMapper } from '../../mappers/user.mapper';
import { UserNotFoundError, ResourceAccessDeniedError } from '../../errors/domain-errors';
import type { StoreFilter } from '../../../domain/value-objects';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: string,
    storeFilter?: StoreFilter
  ): Promise<UserResponseDto> {
    // 1. Buscar usuario
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // Validar que el usuario pertenezca a la tienda del solicitante
    // Solo aplica para ADMIN, SUPERADMIN puede ver cualquier usuario
    if (storeFilter && storeFilter.storeId && user.storeId !== storeFilter.storeId) {
      throw new ResourceAccessDeniedError('usuario');
    }

    // 2. Retornar DTO
    return UserMapper.toResponseDto(user);
  }
}
