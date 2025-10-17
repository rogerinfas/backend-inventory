import { PersonResponseDto, PersonQueryDto } from '../../dto/person';
import { PersonRepository } from '../../../domain/repositories';
import { PersonMapper } from '../../mappers';

export interface ListPersonsResult {
  data: PersonResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListPersonsUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute(query: PersonQueryDto): Promise<ListPersonsResult> {
    const filters = PersonMapper.toQueryFilters(query);
    
    // Obtener datos paginados
    const persons = await this.personRepository.findMany(filters);
    const total = await this.personRepository.count(filters);

    // Convertir a DTOs de respuesta
    const data = persons.map(person => PersonMapper.toResponseDto(person));

    // Calcular metadatos de paginación
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
