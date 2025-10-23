import { Sale, SaleDetail } from '../../domain/entities';
import { 
  CreateSaleDto, 
  CreateSaleDetailDto, 
  UpdateSaleDto, 
  SaleResponseDto, 
  SaleDetailResponseDto,
  SaleQueryDto 
} from '../dto/sale';
import { SaleQueryFilters } from '../../domain/repositories';

export class SaleMapper {
  static toDomain(dto: CreateSaleDto): { sale: Sale; details: SaleDetail[] } {
    const saleId = crypto.randomUUID();
    const saleDate = new Date(dto.saleDate);
    
    // Calcular el subtotal basado en los detalles
    const subtotal = dto.details.reduce((sum, detail) => {
      const detailSubtotal = detail.quantity * detail.unitPrice;
      const detailDiscount = detail.discount || 0;
      return sum + detailSubtotal - detailDiscount;
    }, 0);
    
    // Calcular IGV (18% en Perú)
    const tax = subtotal * 0.18;
    
    const sale = Sale.create(
      saleId,
      dto.storeId,
      dto.customerId,
      dto.userId,
      dto.documentNumber,
      dto.documentType,
      dto.series,
      saleDate,
      subtotal,
      tax,
      dto.discount || 0,
      dto.notes
    );

    const details = dto.details.map(detailDto => {
      const detailId = crypto.randomUUID();
      return SaleDetail.create(
        detailId,
        saleId, // Usar el ID de la venta
        detailDto.productId,
        detailDto.quantity,
        detailDto.unitPrice,
        detailDto.discount || 0
      );
    });

    return { sale, details };
  }

  static toDomainFromUpdate(dto: UpdateSaleDto, existingSale: Sale): Sale {
    // En una implementación real, aquí se actualizarían los campos
    // Por ahora solo retornamos la venta existente
    return existingSale;
  }

  static toResponseDto(sale: Sale, details: SaleDetail[] = []): SaleResponseDto {
    // Agregar detalles a la venta si se proporcionan
    if (details.length > 0) {
      details.forEach(detail => sale.addDetail(detail));
    }

    return {
      id: sale.id,
      storeId: sale.storeId,
      customerId: sale.customerId,
      userId: sale.userId,
      documentNumber: sale.documentNumber,
      documentType: sale.documentType,
      series: sale.series,
      saleDate: sale.saleDate,
      subtotal: sale.subtotal,
      tax: sale.tax,
      discount: sale.discount,
      total: sale.total,
      status: sale.status,
      notes: sale.notes,
      registeredAt: sale.registeredAt,
      updatedAt: sale.updatedAt,
      details: sale.details.map(detail => this.toDetailResponseDto(detail)),
      totalQuantity: sale.totalQuantity,
      totalDiscount: sale.totalDiscount,
    };
  }

  static toDetailResponseDto(detail: SaleDetail): SaleDetailResponseDto {
    return {
      id: detail.id,
      productId: detail.productId,
      quantity: detail.quantity,
      unitPrice: detail.unitPrice,
      discount: detail.discount,
      subtotal: detail.subtotal,
      totalWithDiscount: detail.totalWithDiscount,
      discountPercentage: detail.discountPercentage,
    };
  }

  static toResponseDtoList(sales: Sale[]): SaleResponseDto[] {
    return sales.map(sale => this.toResponseDto(sale));
  }

  static toQueryFilters(query: SaleQueryDto): SaleQueryFilters {
    return {
      storeId: query.storeId,
      customerId: query.customerId,
      userId: query.userId,
      status: query.status,
      documentType: query.documentType,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      documentNumber: query.documentNumber,
      series: query.series,
      page: query.page,
      limit: query.limit,
      offset: query.page && query.limit ? (query.page - 1) * query.limit : undefined,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };
  }
}
