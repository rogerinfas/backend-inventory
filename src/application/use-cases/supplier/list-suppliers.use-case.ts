import { SupplierRepository } from '../../../domain/repositories/supplier.repository';
import { SupplierQueryDto } from '../../dto/supplier';
import { SupplierMapper } from '../../mappers/supplier.mapper';

export interface ListSuppliersResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListSuppliersUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(query: SupplierQueryDto): Promise<ListSuppliersResult> {
    // 1. Convertir DTO a filtros
    const filters = SupplierMapper.toQueryFilters(query);
    
    // 2. Obtener datos paginados
    const suppliers = await this.supplierRepository.findMany(filters);
    const total = await this.supplierRepository.count(filters);

    // 3. Convertir a DTOs
    const data = SupplierMapper.toResponseDtoList(suppliers);

    // 4. Calcular metadatos de paginación
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
}
