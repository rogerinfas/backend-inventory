import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserResponseDto } from '../../dto/user';
import { UserMapper } from '../../mappers/user.mapper';
import { UserNotFoundError } from '../../errors/domain-errors';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<UserResponseDto> {
    // 1. Buscar usuario
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // 2. Retornar DTO
    return UserMapper.toResponseDto(user);
  }
}
