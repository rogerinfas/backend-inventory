import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { CustomerQueryDto } from '../../dto/customer';
import { CustomerMapper } from '../../mappers/customer.mapper';
import type { StoreFilter } from '../../../domain/value-objects';

export interface ListCustomersResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(
    query: CustomerQueryDto,
    storeFilter?: StoreFilter
  ): Promise<ListCustomersResult> {
    // 1. Convertir DTO a filtros
    const filters = CustomerMapper.toQueryFilters(query);
    
    // Aplicar filtro de storeId según el rol del usuario
    // SUPERADMIN (storeFilter.storeId = null): Ve todos los clientes
    // ADMIN/SELLER: Solo ve clientes de su tienda
    if (storeFilter && storeFilter.storeId) {
      filters.storeId = storeFilter.storeId;
    }
    
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
