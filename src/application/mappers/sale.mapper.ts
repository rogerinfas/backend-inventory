import { CreateSaleDto, SaleResponseDto, SaleDetailResponseDto } from '../dto/sale';
import { Sale, SaleData } from '../../domain/entities/sale.entity';
import { SaleDetail, SaleDetailData } from '../../domain/entities/sale-detail.entity';

export class SaleMapper {
  static toDomain(dto: CreateSaleDto): { sale: Sale; details: SaleDetail[] } {
    // Calcular subtotal automáticamente desde los detalles
    const subtotal = dto.details.reduce((sum, detail) => {
      const detailSubtotal = detail.quantity * detail.unitPrice;
      const detailDiscount = detail.discount || 0;
      return sum + detailSubtotal - detailDiscount;
    }, 0);

    const sale = Sale.create(
      dto.storeId,
      dto.customerId,
      dto.userId,
      dto.documentNumber,
      dto.documentType,
      new Date(dto.saleDate),
      subtotal,
      dto.tax,
      dto.discount,
      dto.notes,
    );

    const details = dto.details.map(detail =>
      SaleDetail.create(
        sale.id,
        detail.productId,
        detail.quantity,
        detail.unitPrice,
        detail.discount || 0,
      )
    );

    return { sale, details };
  }

  static toResponseDto(sale: Sale, details: SaleDetail[]): SaleResponseDto {
    return {
      id: sale.id,
      storeId: sale.storeId,
      customerId: sale.customerId,
      userId: sale.userId,
      documentNumber: sale.documentNumber,
      documentType: sale.documentType,
      saleDate: sale.saleDate,
      subtotal: sale.subtotal,
      tax: sale.tax,
      discount: sale.discount,
      total: sale.total,
      status: sale.status,
      notes: sale.notes,
      registeredAt: sale.registeredAt,
      updatedAt: sale.updatedAt,
      details: details.map(detail => this.toDetailResponseDto(detail)),
    };
  }

  static toDetailResponseDto(detail: SaleDetail): SaleDetailResponseDto {
    return {
      id: detail.id,
      saleId: detail.saleId,
      productId: detail.productId,
      quantity: detail.quantity,
      unitPrice: detail.unitPrice,
      discount: detail.discount,
      subtotal: detail.subtotal,
    };
  }

  static toDomainFromPersistence(saleData: SaleData, detailsData: SaleDetailData[]): { sale: Sale; details: SaleDetail[] } {
    const sale = Sale.fromPersistence(saleData);
    const details = detailsData.map(detailData => SaleDetail.fromPersistence(detailData));
    return { sale, details };
  }
}
