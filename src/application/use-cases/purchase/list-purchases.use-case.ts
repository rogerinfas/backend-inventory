import { Injectable } from '@nestjs/common';
import type { PurchaseRepository, PurchaseQueryFilters } from '../../../domain/repositories';
import { PurchaseQueryDto, ListPurchasesResponseDto } from '../../dto/purchase';
import { PurchaseMapper } from '../../mappers';
import type { StoreFilter } from '../../../domain/value-objects';

export interface ListPurchasesResult {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class ListPurchasesUseCase {
  constructor(private readonly purchaseRepository: PurchaseRepository) {}

  async execute(
    query: PurchaseQueryDto,
    storeFilter?: StoreFilter
  ): Promise<ListPurchasesResult> {
    // 1. Construir filtros
    const filters: PurchaseQueryFilters = {
      storeId: query.storeId,
      supplierId: query.supplierId,
      userId: query.userId,
      status: query.status,
      documentType: query.documentType,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      documentNumber: query.documentNumber,
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };

    // Aplicar filtro de storeId según el rol del usuario
    // SUPERADMIN (storeFilter.storeId = null): Ve todas las compras
    // ADMIN/SELLER: Solo ve compras de su tienda
    if (storeFilter && storeFilter.storeId) {
      filters.storeId = storeFilter.storeId;
    }

    // 2. Obtener compras con paginación
    const purchases = await this.purchaseRepository.findByFilters(filters);
    const total = await this.purchaseRepository.countByFilters(filters);

    // 3. Mapear a DTOs de respuesta
    const data = purchases.map(purchase => PurchaseMapper.toResponseDto(purchase));

    // 4. Calcular metadatos de paginación
    const totalPages = Math.ceil(total / (query.limit || 10));

    return {
      data,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 10,
        total,
        totalPages,
      },
    };
  }
}
