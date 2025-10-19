import { Injectable, Inject } from '@nestjs/common';
import type { VoucherSeriesRepository } from '../../domain/repositories';
import {
  CreateVoucherSeriesDto,
  UpdateVoucherSeriesDto,
  VoucherSeriesResponseDto,
  VoucherSeriesQueryDto,
  IncrementVoucherSeriesDto,
} from '../dto/voucher-series';
import {
  CreateVoucherSeriesUseCase,
  UpdateVoucherSeriesUseCase,
  GetVoucherSeriesByIdUseCase,
  ListVoucherSeriesUseCase,
  IncrementVoucherSeriesUseCase,
  GetNextNumberUseCase,
  DeleteVoucherSeriesUseCase,
  ListVoucherSeriesResult,
  NextNumberResult,
} from '../use-cases/voucher-series';

@Injectable()
export class VoucherSeriesService {
  private readonly createVoucherSeriesUseCase: CreateVoucherSeriesUseCase;
  private readonly updateVoucherSeriesUseCase: UpdateVoucherSeriesUseCase;
  private readonly getVoucherSeriesByIdUseCase: GetVoucherSeriesByIdUseCase;
  private readonly listVoucherSeriesUseCase: ListVoucherSeriesUseCase;
  private readonly incrementVoucherSeriesUseCase: IncrementVoucherSeriesUseCase;
  private readonly getNextNumberUseCase: GetNextNumberUseCase;
  private readonly deleteVoucherSeriesUseCase: DeleteVoucherSeriesUseCase;

  constructor(@Inject('VoucherSeriesRepository') voucherSeriesRepository: VoucherSeriesRepository) {
    this.createVoucherSeriesUseCase = new CreateVoucherSeriesUseCase(voucherSeriesRepository);
    this.updateVoucherSeriesUseCase = new UpdateVoucherSeriesUseCase(voucherSeriesRepository);
    this.getVoucherSeriesByIdUseCase = new GetVoucherSeriesByIdUseCase(voucherSeriesRepository);
    this.listVoucherSeriesUseCase = new ListVoucherSeriesUseCase(voucherSeriesRepository);
    this.incrementVoucherSeriesUseCase = new IncrementVoucherSeriesUseCase(voucherSeriesRepository);
    this.getNextNumberUseCase = new GetNextNumberUseCase(voucherSeriesRepository);
    this.deleteVoucherSeriesUseCase = new DeleteVoucherSeriesUseCase(voucherSeriesRepository);
  }

  async createVoucherSeries(dto: CreateVoucherSeriesDto): Promise<VoucherSeriesResponseDto> {
    return this.createVoucherSeriesUseCase.execute(dto);
  }

  async updateVoucherSeries(id: string, dto: UpdateVoucherSeriesDto): Promise<VoucherSeriesResponseDto> {
    return this.updateVoucherSeriesUseCase.execute(id, dto);
  }

  async getVoucherSeriesById(id: string): Promise<VoucherSeriesResponseDto | null> {
    return this.getVoucherSeriesByIdUseCase.execute(id);
  }

  async listVoucherSeries(query: VoucherSeriesQueryDto): Promise<ListVoucherSeriesResult> {
    return this.listVoucherSeriesUseCase.execute(query);
  }

  async incrementVoucherSeries(id: string, dto: IncrementVoucherSeriesDto): Promise<VoucherSeriesResponseDto> {
    return this.incrementVoucherSeriesUseCase.execute(id, dto);
  }

  async getNextNumber(id: string): Promise<NextNumberResult> {
    return this.getNextNumberUseCase.execute(id);
  }

  async deleteVoucherSeries(id: string): Promise<void> {
    return this.deleteVoucherSeriesUseCase.execute(id);
  }
}
