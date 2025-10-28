import { Injectable } from '@nestjs/common';
import { GetSellerStatsUseCase, GetAdminStatsUseCase, GetSuperadminStatsUseCase } from '../use-cases/dashboard';
import { SellerStatsResponseDto, AdminStatsResponseDto, SuperadminStatsResponseDto } from '../dto/dashboard';

@Injectable()
export class DashboardService {
  constructor(
    private readonly getSellerStatsUseCase: GetSellerStatsUseCase,
    private readonly getAdminStatsUseCase: GetAdminStatsUseCase,
    private readonly getSuperadminStatsUseCase: GetSuperadminStatsUseCase,
  ) {}

  async getSellerStats(storeId: string): Promise<SellerStatsResponseDto> {
    return this.getSellerStatsUseCase.execute(storeId);
  }

  async getAdminStats(storeId: string): Promise<AdminStatsResponseDto> {
    return this.getAdminStatsUseCase.execute(storeId);
  }

  async getSuperadminStats(): Promise<SuperadminStatsResponseDto> {
    return this.getSuperadminStatsUseCase.execute();
  }
}

