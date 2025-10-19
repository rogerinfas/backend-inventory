import { IncrementVoucherSeriesDto, VoucherSeriesResponseDto } from '../../dto/voucher-series';
import { VoucherSeriesRepository } from '../../../domain/repositories';
import { VoucherSeriesMapper } from '../../mappers';
import { VoucherSeriesNotFoundError } from '../../errors';

export class IncrementVoucherSeriesUseCase {
  constructor(private readonly voucherSeriesRepository: VoucherSeriesRepository) {}

  async execute(id: string, dto: IncrementVoucherSeriesDto): Promise<VoucherSeriesResponseDto> {
    // Buscar serie existente
    const existingSeries = await this.voucherSeriesRepository.findById(id);
    if (!existingSeries) {
      throw new VoucherSeriesNotFoundError(id);
    }

    // Incrementar el número actual
    for (let i = 0; i < dto.increment; i++) {
      existingSeries.incrementCurrentNumber();
    }

    // Guardar y retornar
    const savedVoucherSeries = await this.voucherSeriesRepository.update(existingSeries);
    return VoucherSeriesMapper.toResponseDto(savedVoucherSeries);
  }
}
