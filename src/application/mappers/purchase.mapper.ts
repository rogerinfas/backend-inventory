import { Purchase, PurchaseDetail } from '../../domain/entities';
import { CreatePurchaseDto, CreatePurchaseDetailDto, UpdatePurchaseDto, UpdatePurchaseDetailDto, PurchaseResponseDto, PurchaseDetailResponseDto } from '../dto/purchase';

export class PurchaseMapper {
  static toDomain(dto: CreatePurchaseDto): { purchase: Purchase; details: PurchaseDetail[] } {
    const purchaseId = crypto.randomUUID();
    const purchaseDate = new Date(dto.purchaseDate);
    
    // Calcular el subtotal basado en los detalles
    const subtotal = dto.details.reduce((sum, detail) => {
      const detailSubtotal = detail.quantity * detail.unitPrice;
      const detailDiscount = detail.discount || 0;
      return sum + detailSubtotal - detailDiscount;
    }, 0);
    
    const purchase = Purchase.create(
      purchaseId,
      dto.storeId,
      dto.supplierId,
      dto.userId,
      dto.documentNumber,
      dto.documentType,
      purchaseDate,
      subtotal,
      dto.tax || 0,
      dto.discount || 0,
      dto.notes
    );

    const details = dto.details.map(detailDto => {
      const detailId = crypto.randomUUID();
      return PurchaseDetail.create(
        detailId,
        purchaseId, // Usar el ID de la compra
        detailDto.productId,
        detailDto.quantity,
        detailDto.unitPrice,
        detailDto.discount || 0
      );
    });

    return { purchase, details };
  }

  static toDomainFromUpdate(dto: UpdatePurchaseDto, existingPurchase: Purchase): Purchase {
    // En una implementación real, aquí se actualizarían los campos modificables
    // Por ahora retornamos la entidad existente
    return existingPurchase;
  }

  static toResponseDto(purchase: Purchase, details: PurchaseDetail[] = []): PurchaseResponseDto {
    // Agregar detalles a la compra
    details.forEach(detail => purchase.addDetail(detail));

    return {
      id: purchase.id,
      storeId: purchase.storeId,
      supplierId: purchase.supplierId,
      userId: purchase.userId,
      documentNumber: purchase.documentNumber,
      documentType: purchase.documentType,
      purchaseDate: purchase.purchaseDate,
      subtotal: purchase.subtotal,
      tax: purchase.tax,
      discount: purchase.discount,
      total: purchase.total,
      status: purchase.status,
      notes: purchase.notes,
      registeredAt: purchase.registeredAt,
      updatedAt: purchase.updatedAt,
      details: details.map(detail => this.toDetailResponseDto(detail)),
      totalQuantity: purchase.totalQuantity,
      totalDiscount: purchase.totalDiscount,
    };
  }

  static toDetailResponseDto(detail: PurchaseDetail): PurchaseDetailResponseDto {
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

  static toDetailDomain(dto: CreatePurchaseDetailDto, purchaseId: string): PurchaseDetail {
    const detailId = crypto.randomUUID();
    return PurchaseDetail.create(
      detailId,
      purchaseId,
      dto.productId,
      dto.quantity,
      dto.unitPrice,
      dto.discount || 0
    );
  }

  static toDetailDomainFromUpdate(dto: UpdatePurchaseDetailDto): PurchaseDetail {
    return PurchaseDetail.create(
      dto.id,
      '', // purchaseId se establecerá en el repositorio
      dto.productId,
      dto.quantity,
      dto.unitPrice,
      dto.discount || 0
    );
  }

  static fromPersistence(purchaseData: any, detailsData: any[] = []): PurchaseResponseDto {
    const purchase = Purchase.fromPersistence(purchaseData);
    const details = detailsData.map(detailData => PurchaseDetail.fromPersistence(detailData));
    
    return this.toResponseDto(purchase, details);
  }
}
