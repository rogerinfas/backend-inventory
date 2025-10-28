import { Injectable, Inject } from '@nestjs/common';
import type { ProductRepository } from '../../../domain/repositories/product.repository';
import type { CustomerRepository } from '../../../domain/repositories/customer.repository';
import type { SaleRepository } from '../../../domain/repositories/sale.repository';
import type { StoreRepository } from '../../../domain/repositories/store.repository';
import { AdminStatsResponseDto } from '../../dto/dashboard';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';
import { SaleStatus } from '../../../domain/enums/sale-status.enum';

@Injectable()
export class GetAdminStatsUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository,
    @Inject('StoreRepository')
    private readonly storeRepository: StoreRepository,
  ) {}

  async execute(storeId: string): Promise<AdminStatsResponseDto> {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Productos disponibles
    const availableProducts = await this.productRepository.countProductsInStock(storeId);

    // Clientes activos
    const activeCustomers = await this.customerRepository.countByStatus(
      EntityStatus.ACTIVE,
      storeId
    );

    // Cantidad de ventas del mes
    const salesThisMonth = await this.saleRepository.countSalesByDateRange(
      firstDayOfMonth,
      new Date(),
      storeId,
      SaleStatus.COMPLETED
    );

    // Ingresos del mes (suma de totales)
    const monthlyRevenue = await this.saleRepository.getTotalSalesByDateRange(
      firstDayOfMonth,
      new Date(),
      storeId,
      SaleStatus.COMPLETED
    );

    // Info de la tienda
    const store = await this.storeRepository.findById(storeId);

    return {
      availableProducts,
      activeCustomers,
      salesThisMonth,
      monthlyRevenue,
      storeId,
      storeName: store?.businessName || 'Sin nombre',
    };
  }
}

