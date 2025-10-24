import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { PurchaseRepository, PurchaseQueryFilters, PurchaseWithDetails } from '../../domain/repositories';
import { Purchase, PurchaseDetail } from '../../domain/entities';

@Injectable()
export class PurchasePrismaRepository implements PurchaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(purchase: Purchase): Promise<Purchase> {
    const created = await this.prisma.purchase.create({
      data: {
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
      },
    });

    return Purchase.fromPersistence({
      ...created,
      documentNumber: created.documentNumber || undefined,
      notes: created.notes || undefined,
      documentType: created.documentType as any,
      status: created.status as any,
    });
  }

  async createWithTransaction(purchase: Purchase, tx?: any): Promise<Purchase> {
    const prisma = tx || this.prisma;
    const created = await prisma.purchase.create({
      data: {
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
      },
    });

    return Purchase.fromPersistence({
      ...created,
      documentNumber: created.documentNumber || undefined,
      notes: created.notes || undefined,
      documentType: created.documentType as any,
      status: created.status as any,
    });
  }

  async findById(id: string): Promise<Purchase | null> {
    const found = await this.prisma.purchase.findUnique({
      where: { id },
    });

    return found ? Purchase.fromPersistence({
      ...found,
      documentNumber: found.documentNumber || undefined,
      notes: found.notes || undefined,
      documentType: found.documentType as any,
      status: found.status as any,
    }) : null;
  }

  async findByStoreAndDocument(storeId: string, documentNumber: string): Promise<Purchase | null> {
    const found = await this.prisma.purchase.findFirst({
      where: {
        storeId,
        documentNumber,
      },
    });

    return found ? Purchase.fromPersistence({
      ...found,
      documentNumber: found.documentNumber || undefined,
      notes: found.notes || undefined,
      documentType: found.documentType as any,
      status: found.status as any,
    }) : null;
  }

  async update(purchase: Purchase): Promise<Purchase> {
    const updated = await this.prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        documentNumber: purchase.documentNumber,
        documentType: purchase.documentType,
        purchaseDate: purchase.purchaseDate,
        subtotal: purchase.subtotal,
        tax: purchase.tax,
        discount: purchase.discount,
        total: purchase.total,
        status: purchase.status,
        notes: purchase.notes,
        updatedAt: new Date(),
      },
    });

    return Purchase.fromPersistence({
      ...updated,
      documentNumber: updated.documentNumber || undefined,
      notes: updated.notes || undefined,
      documentType: updated.documentType as any,
      status: updated.status as any,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.purchase.delete({
      where: { id },
    });
  }

  async findByFilters(filters: PurchaseQueryFilters): Promise<Purchase[]> {
    const where: any = {};

    if (filters.storeId) where.storeId = filters.storeId;
    if (filters.supplierId) where.supplierId = filters.supplierId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.status) where.status = filters.status;
    if (filters.documentType) where.documentType = filters.documentType;
    if (filters.documentNumber) where.documentNumber = filters.documentNumber;
    
    // Búsqueda por texto en número de documento o notas
    if (filters.search) {
      where.OR = [
        { documentNumber: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.startDate || filters.endDate) {
      where.purchaseDate = {};
      if (filters.startDate) where.purchaseDate.gte = filters.startDate;
      if (filters.endDate) where.purchaseDate.lte = filters.endDate;
    }

    const orderBy: any = {};
    if (filters.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.purchaseDate = 'desc';
    }

    const skip = filters.page && filters.limit ? (filters.page - 1) * filters.limit : undefined;
    const take = filters.limit;

    const purchases = await this.prisma.purchase.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return purchases.map(purchase => Purchase.fromPersistence({
      ...purchase,
      documentNumber: purchase.documentNumber || undefined,
      notes: purchase.notes || undefined,
      documentType: purchase.documentType as any,
      status: purchase.status as any,
    }));
  }

  async findByStore(storeId: string, page?: number, limit?: number): Promise<Purchase[]> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit;

    const purchases = await this.prisma.purchase.findMany({
      where: { storeId },
      orderBy: { purchaseDate: 'desc' },
      skip,
      take,
    });

    return purchases.map(purchase => Purchase.fromPersistence({
      ...purchase,
      documentNumber: purchase.documentNumber || undefined,
      notes: purchase.notes || undefined,
      documentType: purchase.documentType as any,
      status: purchase.status as any,
    }));
  }

  async findBySupplier(supplierId: string, page?: number, limit?: number): Promise<Purchase[]> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit;

    const purchases = await this.prisma.purchase.findMany({
      where: { supplierId },
      orderBy: { purchaseDate: 'desc' },
      skip,
      take,
    });

    return purchases.map(purchase => Purchase.fromPersistence({
      ...purchase,
      documentNumber: purchase.documentNumber || undefined,
      notes: purchase.notes || undefined,
      documentType: purchase.documentType as any,
      status: purchase.status as any,
    }));
  }

  async findByUser(userId: string, page?: number, limit?: number): Promise<Purchase[]> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit;

    const purchases = await this.prisma.purchase.findMany({
      where: { userId },
      orderBy: { purchaseDate: 'desc' },
      skip,
      take,
    });

    return purchases.map(purchase => Purchase.fromPersistence({
      ...purchase,
      documentNumber: purchase.documentNumber || undefined,
      notes: purchase.notes || undefined,
      documentType: purchase.documentType as any,
      status: purchase.status as any,
    }));
  }

  async findByDateRange(storeId: string, startDate: Date, endDate: Date): Promise<Purchase[]> {
    const purchases = await this.prisma.purchase.findMany({
      where: {
        storeId,
        purchaseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { purchaseDate: 'desc' },
    });

    return purchases.map(purchase => Purchase.fromPersistence({
      ...purchase,
      documentNumber: purchase.documentNumber || undefined,
      notes: purchase.notes || undefined,
      documentType: purchase.documentType as any,
      status: purchase.status as any,
    }));
  }

  async countByFilters(filters: PurchaseQueryFilters): Promise<number> {
    const where: any = {};

    if (filters.storeId) where.storeId = filters.storeId;
    if (filters.supplierId) where.supplierId = filters.supplierId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.status) where.status = filters.status;
    if (filters.documentType) where.documentType = filters.documentType;
    if (filters.documentNumber) where.documentNumber = filters.documentNumber;
    
    // Búsqueda por texto en número de documento o notas
    if (filters.search) {
      where.OR = [
        { documentNumber: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.startDate || filters.endDate) {
      where.purchaseDate = {};
      if (filters.startDate) where.purchaseDate.gte = filters.startDate;
      if (filters.endDate) where.purchaseDate.lte = filters.endDate;
    }

    return this.prisma.purchase.count({ where });
  }

  async getTotalAmountByStore(storeId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const where: any = { storeId };

    if (startDate || endDate) {
      where.purchaseDate = {};
      if (startDate) where.purchaseDate.gte = startDate;
      if (endDate) where.purchaseDate.lte = endDate;
    }

    const result = await this.prisma.purchase.aggregate({
      where,
      _sum: { total: true },
    });

    return result._sum.total || 0;
  }

  async getTotalAmountBySupplier(supplierId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const where: any = { supplierId };

    if (startDate || endDate) {
      where.purchaseDate = {};
      if (startDate) where.purchaseDate.gte = startDate;
      if (endDate) where.purchaseDate.lte = endDate;
    }

    const result = await this.prisma.purchase.aggregate({
      where,
      _sum: { total: true },
    });

    return result._sum.total || 0;
  }

  async createWithDetails(purchase: Purchase, details: PurchaseDetail[]): Promise<PurchaseWithDetails> {
    const createdPurchase = await this.create(purchase);
    
    const createdDetails = await Promise.all(
      details.map(detail => this.createDetail(detail))
    );

    return {
      purchase: createdPurchase,
      details: createdDetails,
    };
  }

  async createWithDetailsTransaction(purchase: Purchase, details: PurchaseDetail[], tx?: any): Promise<PurchaseWithDetails> {
    const prisma = tx || this.prisma;
    
    const createdPurchase = await this.createWithTransaction(purchase, tx);
    
    const createdDetails = await Promise.all(
      details.map(detail => this.createDetailWithTransaction(detail, tx))
    );

    return {
      purchase: createdPurchase,
      details: createdDetails,
    };
  }

  async findWithDetails(id: string): Promise<PurchaseWithDetails | null> {
    const purchase = await this.findById(id);
    if (!purchase) return null;

    const details = await this.findDetailsByPurchaseId(id);
    
    return {
      purchase,
      details,
    };
  }

  async updateDetails(purchaseId: string, details: PurchaseDetail[]): Promise<void> {
    // Eliminar detalles existentes
    await this.prisma.purchaseDetail.deleteMany({
      where: { purchaseId },
    });

    // Crear nuevos detalles
    await Promise.all(
      details.map(detail => this.createDetail(detail))
    );
  }

  private async createDetail(detail: PurchaseDetail): Promise<PurchaseDetail> {
    const created = await this.prisma.purchaseDetail.create({
      data: {
        id: detail.id,
        purchaseId: detail.purchaseId,
        productId: detail.productId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        discount: detail.discount,
      },
    });

    return PurchaseDetail.fromPersistence(created);
  }

  private async createDetailWithTransaction(detail: PurchaseDetail, tx?: any): Promise<PurchaseDetail> {
    const prisma = tx || this.prisma;
    
    const created = await prisma.purchaseDetail.create({
      data: {
        id: detail.id,
        purchaseId: detail.purchaseId,
        productId: detail.productId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        discount: detail.discount,
      },
    });

    return PurchaseDetail.fromPersistence({
      id: created.id,
      purchaseId: created.purchaseId,
      productId: created.productId,
      quantity: created.quantity,
      unitPrice: created.unitPrice,
      discount: created.discount,
    });
  }

  private async findDetailsByPurchaseId(purchaseId: string): Promise<PurchaseDetail[]> {
    const details = await this.prisma.purchaseDetail.findMany({
      where: { purchaseId },
    });

    return details.map(detail => PurchaseDetail.fromPersistence({
      id: detail.id,
      purchaseId: detail.purchaseId,
      productId: detail.productId,
      quantity: detail.quantity,
      unitPrice: detail.unitPrice,
      discount: detail.discount,
    }));
  }
}
