import { UpdateVoucherSeriesDto, VoucherSeriesResponseDto } from '../../dto/voucher-series';
import { VoucherSeriesRepository } from '../../../domain/repositories';
import { VoucherSeriesMapper } from '../../mappers';
import { VoucherSeriesNotFoundError, VoucherSeriesAlreadyExistsError } from '../../errors';

export class UpdateVoucherSeriesUseCase {
  constructor(private readonly voucherSeriesRepository: VoucherSeriesRepository) {}

  async execute(id: string, dto: UpdateVoucherSeriesDto): Promise<VoucherSeriesResponseDto> {
    // Buscar serie existente
    const existingSeries = await this.voucherSeriesRepository.findById(id);
    if (!existingSeries) {
      throw new VoucherSeriesNotFoundError(id);
    }

    // Verificar serie única si se actualiza
    if (dto.series && dto.series !== existingSeries.series) {
      const existingSeriesWithSameData = await this.voucherSeriesRepository.findByStoreTypeAndSeries(
        existingSeries.storeId,
        dto.voucherType || existingSeries.voucherType,
        dto.series
      );
      if (existingSeriesWithSameData && existingSeriesWithSameData.id !== id) {
        throw new VoucherSeriesAlreadyExistsError('serie', `${dto.voucherType || existingSeries.voucherType}-${dto.series}`);
      }
    }

    // Aplicar actualizaciones
    const updatedVoucherSeries = VoucherSeriesMapper.toUpdateDomain(dto, existingSeries);

    // Guardar y retornar
    const savedVoucherSeries = await this.voucherSeriesRepository.update(updatedVoucherSeries);
    return VoucherSeriesMapper.toResponseDto(savedVoucherSeries);
  }
}
