import { VoucherSeriesResponseDto } from '../../dto/voucher-series';
import { VoucherSeriesRepository } from '../../../domain/repositories';
import { VoucherSeriesMapper } from '../../mappers';
import { VoucherSeriesNotFoundError } from '../../errors';

export interface NextNumberResult {
  currentNumber: number;
  nextNumber: number;
  formattedNumber: string;
  nextFormattedNumber: string;
}

export class GetNextNumberUseCase {
  constructor(private readonly voucherSeriesRepository: VoucherSeriesRepository) {}

  async execute(id: string): Promise<NextNumberResult> {
    // Buscar serie existente
    const existingSeries = await this.voucherSeriesRepository.findById(id);
    if (!existingSeries) {
      throw new VoucherSeriesNotFoundError(id);
    }

    return {
      currentNumber: existingSeries.currentNumber,
      nextNumber: existingSeries.getNextNumber(),
      formattedNumber: existingSeries.getFormattedNumber(),
      nextFormattedNumber: existingSeries.getNextFormattedNumber(),
    };
  }
}
