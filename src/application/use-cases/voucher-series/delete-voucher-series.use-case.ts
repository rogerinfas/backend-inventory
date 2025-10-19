import { VoucherSeriesResponseDto } from '../../dto/voucher-series';
import { VoucherSeriesRepository } from '../../../domain/repositories';
import { VoucherSeriesMapper } from '../../mappers';
import { VoucherSeriesNotFoundError } from '../../errors';

export class DeleteVoucherSeriesUseCase {
  constructor(private readonly voucherSeriesRepository: VoucherSeriesRepository) {}

  async execute(id: string): Promise<void> {
    // Buscar serie existente
    const existingSeries = await this.voucherSeriesRepository.findById(id);
    if (!existingSeries) {
      throw new VoucherSeriesNotFoundError(id);
    }

    // Eliminar la serie
    await this.voucherSeriesRepository.delete(id);
  }
}
