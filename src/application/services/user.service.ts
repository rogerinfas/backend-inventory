import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { PersonRepository } from '../../domain/repositories/person.repository';
import type { StoreRepository } from '../../domain/repositories/store.repository';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import {
  CreateUserDto,
  CreateUserWithPersonDto,
  UpdateUserDto,
  UserResponseDto,
  UserWithPersonResponseDto,
  UserQueryDto,
  ChangeUserStatusDto,
} from '../dto/user';
import {
  CreateUserUseCase,
  CreateUserWithPersonUseCase,
  UpdateUserUseCase,
  GetUserByIdUseCase,
  ListUsersUseCase,
  ListUsersResult,
  ChangeUserStatusUseCase,
  DeleteUserUseCase,
} from '../use-cases/user';

@Injectable()
export class UserService {
  private readonly createUserUseCase: CreateUserUseCase;
  private readonly createUserWithPersonUseCase: CreateUserWithPersonUseCase;
  private readonly updateUserUseCase: UpdateUserUseCase;
  private readonly getUserByIdUseCase: GetUserByIdUseCase;
  private readonly listUsersUseCase: ListUsersUseCase;
  private readonly changeUserStatusUseCase: ChangeUserStatusUseCase;
  private readonly deleteUserUseCase: DeleteUserUseCase;

  constructor(
    @Inject('UserRepository') userRepository: UserRepository,
    @Inject('PersonRepository') personRepository: PersonRepository,
    @Inject('StoreRepository') storeRepository: StoreRepository,
    private readonly prismaService: PrismaService,
  ) {
    this.createUserUseCase = new CreateUserUseCase(userRepository);
    this.createUserWithPersonUseCase = new CreateUserWithPersonUseCase(
      personRepository,
      userRepository,
      storeRepository,
      prismaService
    );
    this.updateUserUseCase = new UpdateUserUseCase(userRepository);
    this.getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    this.listUsersUseCase = new ListUsersUseCase(userRepository);
    this.changeUserStatusUseCase = new ChangeUserStatusUseCase(userRepository);
    this.deleteUserUseCase = new DeleteUserUseCase(userRepository);
  }

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(dto);
  }

  async createUserWithPerson(dto: CreateUserWithPersonDto): Promise<UserWithPersonResponseDto> {
    return this.createUserWithPersonUseCase.execute(dto);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    return this.updateUserUseCase.execute(id, dto);
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    return this.getUserByIdUseCase.execute(id);
  }

  async listUsers(query: UserQueryDto): Promise<ListUsersResult> {
    return this.listUsersUseCase.execute(query);
  }

  async changeUserStatus(id: string, dto: ChangeUserStatusDto): Promise<UserResponseDto> {
    return this.changeUserStatusUseCase.execute(id, dto);
  }

  async deleteUser(id: string): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}
