import { VoucherSeries } from '../../domain/entities/voucher-series.entity';
import { CreateVoucherSeriesDto, UpdateVoucherSeriesDto, VoucherSeriesResponseDto, VoucherSeriesQueryDto } from '../dto/voucher-series';
import { VoucherSeriesQueryFilters } from '../../domain/repositories/voucher-series.repository';

export class VoucherSeriesMapper {
  // DTO → Entidad
  static toDomain(dto: CreateVoucherSeriesDto, id: string): VoucherSeries {
    return VoucherSeries.create(
      id,
      dto.storeId,
      dto.voucherType,
      dto.series,
      dto.currentNumber
    );
  }

  // Entidad → DTO de respuesta
  static toResponseDto(voucherSeries: VoucherSeries): VoucherSeriesResponseDto {
    return {
      id: voucherSeries.id,
      storeId: voucherSeries.storeId,
      voucherType: voucherSeries.voucherType,
      series: voucherSeries.series,
      currentNumber: voucherSeries.currentNumber,
      createdAt: voucherSeries.createdAt,
      updatedAt: voucherSeries.updatedAt,
    };
  }

  // Aplicar actualizaciones a entidad existente
  static toUpdateDomain(dto: UpdateVoucherSeriesDto, existingVoucherSeries: VoucherSeries): VoucherSeries {
    if (!this.validateUpdateDto(dto)) {
      throw new Error('No hay campos válidos para actualizar');
    }

    if (dto.voucherType !== undefined) {
      existingVoucherSeries.updateVoucherType(dto.voucherType);
    }
    if (dto.series !== undefined) {
      existingVoucherSeries.updateSeries(dto.series);
    }
    if (dto.currentNumber !== undefined) {
      existingVoucherSeries.updateCurrentNumber(dto.currentNumber);
    }

    return existingVoucherSeries;
  }

  // DTO de consulta → Filtros del repositorio
  static toQueryFilters(query: VoucherSeriesQueryDto): VoucherSeriesQueryFilters {
    return {
      storeId: query.storeId,
      voucherType: query.voucherType,
      series: query.series,
      offset: query.page ? (query.page - 1) * (query.limit || 10) : 0,
      limit: query.limit || 10,
      sortBy: query.sortBy || 'createdAt',
      sortOrder: query.sortOrder || 'desc',
    };
  }

  // Validar DTO de actualización
  static validateUpdateDto(dto: UpdateVoucherSeriesDto): boolean {
    const fields = Object.keys(dto) as (keyof UpdateVoucherSeriesDto)[];
    return fields.some(field => {
      const value = dto[field];
      return value !== undefined && value !== null && value !== '';
    });
  }
}
