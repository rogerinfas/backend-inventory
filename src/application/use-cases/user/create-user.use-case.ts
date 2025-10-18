import { UserRepository } from '../../../domain/repositories/user.repository';
import { CreateUserDto, UserResponseDto } from '../../dto/user';
import { UserMapper } from '../../mappers/user.mapper';
import { UserAlreadyExistsError } from '../../errors/domain-errors';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // 1. Verificar que no exista ya un usuario con ese email
    const existingUser = await this.userRepository.findByEmail(dto.email);
    
    if (existingUser) {
      throw new UserAlreadyExistsError('email', dto.email);
    }

    // 2. Verificar que no exista ya un usuario para esa tienda y persona
    const existingUserByStoreAndPerson = await this.userRepository.findByStoreAndEmail(
      dto.storeId,
      dto.email
    );
    
    if (existingUserByStoreAndPerson) {
      throw new UserAlreadyExistsError('email', dto.email);
    }

    // 3. Hashear la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    // 4. Crear entidad
    const id = crypto.randomUUID();
    const user = UserMapper.toDomain(dto, id, passwordHash);

    // 5. Guardar
    const savedUser = await this.userRepository.save(user);

    // 6. Retornar DTO
    return UserMapper.toResponseDto(savedUser);
  }
}
