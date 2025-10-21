import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { SaleRepository, SaleQueryFilters, SaleWithDetails } from '../../domain/repositories/sale.repository';
import { Sale } from '../../domain/entities/sale.entity';
import { SaleDetail } from '../../domain/entities/sale-detail.entity';
import { SaleStatus } from '../../domain/enums/sale-status.enum';
import { SaleDocumentType } from '../../domain/enums/sale-document-type.enum';

@Injectable()
export class SalePrismaRepository implements SaleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Sale | null> {
    const saleData = await this.prisma.sale.findUnique({
      where: { id },
    });

    if (!saleData) {
      return null;
    }

    return Sale.fromPersistence({
      id: saleData.id,
      storeId: saleData.storeId,
      customerId: saleData.customerId,
      userId: saleData.userId,
      documentNumber: saleData.documentNumber || undefined,
      documentType: saleData.documentType as SaleDocumentType,
      saleDate: saleData.saleDate,
      subtotal: saleData.subtotal,
      tax: saleData.tax,
      discount: saleData.discount,
      total: saleData.total,
      status: saleData.status as SaleStatus,
      notes: saleData.notes || undefined,
      registeredAt: saleData.registeredAt,
      updatedAt: saleData.updatedAt,
    });
  }

  async findByStoreId(storeId: string): Promise<Sale[]> {
    const salesData = await this.prisma.sale.findMany({
      where: { storeId },
    });

    return salesData.map(saleData =>
      Sale.fromPersistence({
        id: saleData.id,
        storeId: saleData.storeId,
        customerId: saleData.customerId,
        userId: saleData.userId,
        documentNumber: saleData.documentNumber || undefined,
        documentType: saleData.documentType as SaleDocumentType,
        saleDate: saleData.saleDate,
        subtotal: saleData.subtotal,
        tax: saleData.tax,
        discount: saleData.discount,
        total: saleData.total,
        status: saleData.status as SaleStatus,
        notes: saleData.notes || undefined,
        registeredAt: saleData.registeredAt,
        updatedAt: saleData.updatedAt,
      })
    );
  }

  async findByCustomerId(customerId: string): Promise<Sale[]> {
    const salesData = await this.prisma.sale.findMany({
      where: { customerId },
    });

    return salesData.map(saleData =>
      Sale.fromPersistence({
        id: saleData.id,
        storeId: saleData.storeId,
        customerId: saleData.customerId,
        userId: saleData.userId,
        documentNumber: saleData.documentNumber || undefined,
        documentType: saleData.documentType as SaleDocumentType,
        saleDate: saleData.saleDate,
        subtotal: saleData.subtotal,
        tax: saleData.tax,
        discount: saleData.discount,
        total: saleData.total,
        status: saleData.status as SaleStatus,
        notes: saleData.notes || undefined,
        registeredAt: saleData.registeredAt,
        updatedAt: saleData.updatedAt,
      })
    );
  }

  async findByUserId(userId: string): Promise<Sale[]> {
    const salesData = await this.prisma.sale.findMany({
      where: { userId },
    });

    return salesData.map(saleData =>
      Sale.fromPersistence({
        id: saleData.id,
        storeId: saleData.storeId,
        customerId: saleData.customerId,
        userId: saleData.userId,
        documentNumber: saleData.documentNumber || undefined,
        documentType: saleData.documentType as SaleDocumentType,
        saleDate: saleData.saleDate,
        subtotal: saleData.subtotal,
        tax: saleData.tax,
        discount: saleData.discount,
        total: saleData.total,
        status: saleData.status as SaleStatus,
        notes: saleData.notes || undefined,
        registeredAt: saleData.registeredAt,
        updatedAt: saleData.updatedAt,
      })
    );
  }

  async findByDocumentNumber(documentNumber: string): Promise<Sale | null> {
    const saleData = await this.prisma.sale.findFirst({
      where: { documentNumber },
    });

    if (!saleData) {
      return null;
    }

    return Sale.fromPersistence({
      id: saleData.id,
      storeId: saleData.storeId,
      customerId: saleData.customerId,
      userId: saleData.userId,
      documentNumber: saleData.documentNumber || undefined,
      documentType: saleData.documentType as SaleDocumentType,
      saleDate: saleData.saleDate,
      subtotal: saleData.subtotal,
      tax: saleData.tax,
      discount: saleData.discount,
      total: saleData.total,
      status: saleData.status as SaleStatus,
      notes: saleData.notes || undefined,
      registeredAt: saleData.registeredAt,
      updatedAt: saleData.updatedAt,
    });
  }

  async findMany(filters: SaleQueryFilters): Promise<Sale[]> {
    const where: any = {};

    if (filters.storeId) {
      where.storeId = filters.storeId;
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      where.saleDate = {};
      if (filters.startDate) {
        where.saleDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.saleDate.lte = filters.endDate;
      }
    }

    if (filters.search) {
      where.OR = [
        { documentNumber: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const salesData = await this.prisma.sale.findMany({
      where,
      skip: filters.offset || 0,
      take: filters.limit || 10,
      orderBy: {
        [filters.sortBy || 'registeredAt']: filters.sortOrder || 'desc',
      },
    });

    return salesData.map(saleData =>
      Sale.fromPersistence({
        id: saleData.id,
        storeId: saleData.storeId,
        customerId: saleData.customerId,
        userId: saleData.userId,
        documentNumber: saleData.documentNumber || undefined,
        documentType: saleData.documentType as SaleDocumentType,
        saleDate: saleData.saleDate,
        subtotal: saleData.subtotal,
        tax: saleData.tax,
        discount: saleData.discount,
        total: saleData.total,
        status: saleData.status as SaleStatus,
        notes: saleData.notes || undefined,
        registeredAt: saleData.registeredAt,
        updatedAt: saleData.updatedAt,
      })
    );
  }

  async save(sale: Sale): Promise<Sale> {
    const saleData = await this.prisma.sale.create({
      data: {
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
      },
    });

    return Sale.fromPersistence({
      id: saleData.id,
      storeId: saleData.storeId,
      customerId: saleData.customerId,
      userId: saleData.userId,
      documentNumber: saleData.documentNumber || undefined,
      documentType: saleData.documentType as SaleDocumentType,
      saleDate: saleData.saleDate,
      subtotal: saleData.subtotal,
      tax: saleData.tax,
      discount: saleData.discount,
      total: saleData.total,
      status: saleData.status as SaleStatus,
      notes: saleData.notes || undefined,
      registeredAt: saleData.registeredAt,
      updatedAt: saleData.updatedAt,
    });
  }

  async update(sale: Sale): Promise<Sale> {
    const saleData = await this.prisma.sale.update({
      where: { id: sale.id },
      data: {
        documentNumber: sale.documentNumber,
        documentType: sale.documentType,
        saleDate: sale.saleDate,
        subtotal: sale.subtotal,
        tax: sale.tax,
        discount: sale.discount,
        total: sale.total,
        status: sale.status,
        notes: sale.notes,
        updatedAt: sale.updatedAt,
      },
    });

    return Sale.fromPersistence({
      id: saleData.id,
      storeId: saleData.storeId,
      customerId: saleData.customerId,
      userId: saleData.userId,
      documentNumber: saleData.documentNumber || undefined,
      documentType: saleData.documentType as SaleDocumentType,
      saleDate: saleData.saleDate,
      subtotal: saleData.subtotal,
      tax: saleData.tax,
      discount: saleData.discount,
      total: saleData.total,
      status: saleData.status as SaleStatus,
      notes: saleData.notes || undefined,
      registeredAt: saleData.registeredAt,
      updatedAt: saleData.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.sale.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.sale.count({
      where: { id },
    });
    return count > 0;
  }

  async existsByDocumentNumber(documentNumber: string): Promise<boolean> {
    const count = await this.prisma.sale.count({
      where: { documentNumber },
    });
    return count > 0;
  }

  async count(filters: SaleQueryFilters): Promise<number> {
    const where: any = {};

    if (filters.storeId) {
      where.storeId = filters.storeId;
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      where.saleDate = {};
      if (filters.startDate) {
        where.saleDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.saleDate.lte = filters.endDate;
      }
    }

    if (filters.search) {
      where.OR = [
        { documentNumber: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.sale.count({ where });
  }

  async createWithDetailsTransaction(sale: Sale, details: SaleDetail[], tx?: any): Promise<SaleWithDetails> {
    const prisma = tx || this.prisma;

    // Crear la venta
    const createdSale = await this.createWithTransaction(sale, prisma);

    // Crear los detalles
    const createdDetails: SaleDetail[] = [];
    for (const detail of details) {
      const createdDetail = await this.createDetailWithTransaction(detail, prisma);
      createdDetails.push(createdDetail);
    }

    return {
      sale: createdSale,
      details: createdDetails,
    };
  }

  private async createWithTransaction(sale: Sale, tx?: any): Promise<Sale> {
    const prisma = tx || this.prisma;
    const created = await prisma.sale.create({
      data: {
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
      },
    });

    return Sale.fromPersistence({
      id: created.id,
      storeId: created.storeId,
      customerId: created.customerId,
      userId: created.userId,
      documentNumber: created.documentNumber || undefined,
      documentType: created.documentType as SaleDocumentType,
      saleDate: created.saleDate,
      subtotal: created.subtotal,
      tax: created.tax,
      discount: created.discount,
      total: created.total,
      status: created.status as SaleStatus,
      notes: created.notes || undefined,
      registeredAt: created.registeredAt,
      updatedAt: created.updatedAt,
    });
  }

  private async createDetailWithTransaction(detail: SaleDetail, tx?: any): Promise<SaleDetail> {
    const prisma = tx || this.prisma;
    const created = await prisma.saleDetail.create({
      data: {
        id: detail.id,
        saleId: detail.saleId,
        productId: detail.productId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        discount: detail.discount,
      },
    });

    return SaleDetail.fromPersistence({
      id: created.id,
      saleId: created.saleId,
      productId: created.productId,
      quantity: created.quantity,
      unitPrice: created.unitPrice,
      discount: created.discount,
    });
  }
}
