import { VoucherSeriesResponseDto } from '../../dto/voucher-series';
import { VoucherSeriesRepository } from '../../../domain/repositories';
import { VoucherSeriesMapper } from '../../mappers';

export class GetVoucherSeriesByIdUseCase {
  constructor(private readonly voucherSeriesRepository: VoucherSeriesRepository) {}

  async execute(id: string): Promise<VoucherSeriesResponseDto | null> {
    const voucherSeries = await this.voucherSeriesRepository.findById(id);
    
    if (!voucherSeries) {
      return null;
    }

    return VoucherSeriesMapper.toResponseDto(voucherSeries);
  }
}
