import { UserRepository, UserQueryFilters } from '../../../domain/repositories/user.repository';
import { UserQueryDto, UserResponseDto } from '../../dto/user';
import { UserMapper } from '../../mappers/user.mapper';

export interface ListUsersResult {
  data: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: UserQueryDto): Promise<ListUsersResult> {
    // 1. Preparar filtros
    const filters: UserQueryFilters = {
      storeId: query.storeId,
      role: query.role,
      status: query.status,
      search: query.search,
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };

    // 2. Buscar usuarios
    const users = await this.userRepository.findMany(filters);
    const total = await this.userRepository.count(filters);

    // 3. Convertir a DTOs
    const userDtos = users.map(user => UserMapper.toResponseDto(user));

    // 4. Calcular paginación
    const totalPages = Math.ceil(total / (query.limit || 10));

    return {
      data: userDtos,
      total,
      page: query.page || 1,
      limit: query.limit || 10,
      totalPages,
    };
  }
}
