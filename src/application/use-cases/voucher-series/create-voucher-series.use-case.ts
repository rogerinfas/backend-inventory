import { VoucherSeries } from '../../../domain/entities/voucher-series.entity';
import { CreateVoucherSeriesDto, VoucherSeriesResponseDto } from '../../dto/voucher-series';
import { VoucherSeriesRepository } from '../../../domain/repositories';
import { VoucherSeriesMapper } from '../../mappers';
import { VoucherSeriesAlreadyExistsError } from '../../errors';

export class CreateVoucherSeriesUseCase {
  constructor(private readonly voucherSeriesRepository: VoucherSeriesRepository) {}

  async execute(dto: CreateVoucherSeriesDto): Promise<VoucherSeriesResponseDto> {
    // Verificar que no exista otra serie con el mismo storeId, voucherType y series
    const existingSeries = await this.voucherSeriesRepository.findByStoreTypeAndSeries(
      dto.storeId,
      dto.voucherType,
      dto.series
    );
    if (existingSeries) {
      throw new VoucherSeriesAlreadyExistsError('serie', `${dto.voucherType}-${dto.series}`);
    }

    // Generar ID único
    const id = crypto.randomUUID();

    // Crear la entidad VoucherSeries
    const voucherSeries = VoucherSeriesMapper.toDomain(dto, id);

    // Guardar en el repositorio
    const savedVoucherSeries = await this.voucherSeriesRepository.save(voucherSeries);

    // Retornar DTO de respuesta
    return VoucherSeriesMapper.toResponseDto(savedVoucherSeries);
  }
}
