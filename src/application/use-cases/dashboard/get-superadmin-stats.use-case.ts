import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import type { StoreRepository } from '../../../domain/repositories/store.repository';
import type { SaleRepository } from '../../../domain/repositories/sale.repository';
import { SuperadminStatsResponseDto } from '../../dto/dashboard';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';
import { SaleStatus } from '../../../domain/enums/sale-status.enum';

@Injectable()
export class GetSuperadminStatsUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('StoreRepository')
    private readonly storeRepository: StoreRepository,
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository,
  ) {}

  async execute(): Promise<SuperadminStatsResponseDto> {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Total de usuarios (activos)
    const totalUsers = await this.userRepository.countByStatus(EntityStatus.ACTIVE);

    // Tiendas activas
    const activeStores = await this.storeRepository.countByStatus(EntityStatus.ACTIVE);

    // Ingresos totales de todas las tiendas (mes actual)
    const totalRevenue = await this.saleRepository.getTotalSalesByDateRange(
      firstDayOfMonth,
      new Date(),
      null, // null = todas las tiendas
      SaleStatus.COMPLETED
    );

    // Transacciones del mes (cantidad)
    const transactionsThisMonth = await this.saleRepository.countSalesByDateRange(
      firstDayOfMonth,
      new Date(),
      null, // null = todas las tiendas
      SaleStatus.COMPLETED
    );

    return {
      totalUsers,
      activeStores,
      totalRevenue,
      transactionsThisMonth,
    };
  }
}

