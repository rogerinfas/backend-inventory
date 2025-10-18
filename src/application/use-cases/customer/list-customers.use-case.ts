import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { CustomerQueryDto } from '../../dto/customer';
import { CustomerMapper } from '../../mappers/customer.mapper';

export interface ListCustomersResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(query: CustomerQueryDto): Promise<ListCustomersResult> {
    // 1. Convertir DTO a filtros
    const filters = CustomerMapper.toQueryFilters(query);
    
    // 2. Obtener datos paginados
    const customers = await this.customerRepository.findMany(filters);
    const total = await this.customerRepository.count(filters);

    // 3. Convertir a DTOs
    const data = CustomerMapper.toResponseDtoList(customers);

    // 4. Calcular metadatos de paginación
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
}
