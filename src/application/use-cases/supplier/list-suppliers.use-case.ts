import { SupplierRepository } from '../../../domain/repositories/supplier.repository';
import { SupplierQueryDto } from '../../dto/supplier';
import { SupplierMapper } from '../../mappers/supplier.mapper';
import type { StoreFilter } from '../../../domain/value-objects';

export interface ListSuppliersResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListSuppliersUseCase {
  constructor(private readonly supplierRepository: SupplierRepository) {}

  async execute(
    query: SupplierQueryDto,
    storeFilter?: StoreFilter
  ): Promise<ListSuppliersResult> {
    // 1. Convertir DTO a filtros
    const filters = SupplierMapper.toQueryFilters(query);
    
    // Aplicar filtro de storeId según el rol del usuario
    // SUPERADMIN (storeFilter.storeId = null): Ve todos los proveedores
    // ADMIN/SELLER: Solo ve proveedores de su tienda
    if (storeFilter && storeFilter.storeId) {
      filters.storeId = storeFilter.storeId;
    }
    
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
