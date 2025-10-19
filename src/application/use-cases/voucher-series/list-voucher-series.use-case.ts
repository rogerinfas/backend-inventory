import { VoucherSeriesQueryDto, VoucherSeriesResponseDto } from '../../dto/voucher-series';
import { VoucherSeriesRepository } from '../../../domain/repositories';
import { VoucherSeriesMapper } from '../../mappers';

export interface ListVoucherSeriesResult {
  data: VoucherSeriesResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListVoucherSeriesUseCase {
  constructor(private readonly voucherSeriesRepository: VoucherSeriesRepository) {}

  async execute(query: VoucherSeriesQueryDto): Promise<ListVoucherSeriesResult> {
    const filters = VoucherSeriesMapper.toQueryFilters(query);
    
    // Obtener datos paginados
    const voucherSeries = await this.voucherSeriesRepository.findMany(filters);
    const total = await this.voucherSeriesRepository.count(filters);

    // Convertir a DTOs
    const data = voucherSeries.map(voucherSeries => VoucherSeriesMapper.toResponseDto(voucherSeries));

    // Calcular metadatos de paginación
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
}
