import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { SaleRepository, SaleQueryFilters, SaleWithDetails } from '../../domain/repositories';
import { Sale, SaleDetail } from '../../domain/entities';

@Injectable()
export class SalePrismaRepository implements SaleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(sale: Sale): Promise<Sale> {
    const created = await this.prisma.sale.create({
      data: {
        id: sale.id,
        storeId: sale.storeId,
        customerId: sale.customerId,
        userId: sale.userId,
        documentNumber: sale.documentNumber,
        documentType: sale.documentType as any,
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
      },
    });

    return Sale.fromPersistence({
      ...created,
      documentNumber: created.documentNumber || undefined,
      notes: created.notes || undefined,
      documentType: created.documentType as any,
      status: created.status as any,
    });
  }

  async createWithTransaction(sale: Sale, tx?: any): Promise<Sale> {
    const prisma = tx || this.prisma;
    const created = await prisma.sale.create({
      data: {
        id: sale.id,
        storeId: sale.storeId,
        customerId: sale.customerId,
        userId: sale.userId,
        documentNumber: sale.documentNumber,
        documentType: sale.documentType as any,
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
      },
    });

    return Sale.fromPersistence({
      ...created,
      documentNumber: created.documentNumber || undefined,
      notes: created.notes || undefined,
      documentType: created.documentType as any,
      status: created.status as any,
    });
  }

  async createWithDetailsTransaction(
    sale: Sale, 
    details: SaleDetail[], 
    tx?: any
  ): Promise<SaleWithDetails> {
    const prisma = tx || this.prisma;
    
    // Crear la venta
    const createdSale = await this.createWithTransaction(sale, tx);
    
    // Crear los detalles
    const createdDetails = await Promise.all(
      details.map(detail => prisma.saleDetail.create({
        data: {
          id: detail.id,
          saleId: detail.saleId,
          productId: detail.productId,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice,
          discount: detail.discount,
        },
      }))
    );

    return {
      sale: createdSale,
      details: createdDetails,
    };
  }

  async findById(id: string): Promise<Sale | null> {
    const found = await this.prisma.sale.findUnique({
      where: { id },
    });

    return found ? Sale.fromPersistence({
      ...found,
      documentNumber: found.documentNumber || undefined,
      notes: found.notes || undefined,
      documentType: found.documentType as any,
      status: found.status as any,
    }) : null;
  }

  async findByIdWithDetails(id: string): Promise<SaleWithDetails | null> {
    const found = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        details: true,
      },
    });

    if (!found) {
      return null;
    }

    const sale = Sale.fromPersistence({
      ...found,
      documentNumber: found.documentNumber || undefined,
      notes: found.notes || undefined,
      documentType: found.documentType as any,
      status: found.status as any,
    });

    const details = found.details.map(detail => SaleDetail.fromPersistence({
      id: detail.id,
      saleId: detail.saleId,
      productId: detail.productId,
      quantity: detail.quantity,
      unitPrice: detail.unitPrice,
      discount: detail.discount,
    }));

    return { sale, details };
  }

  async findByStoreAndDocument(storeId: string, documentNumber: string): Promise<Sale | null> {
    const found = await this.prisma.sale.findFirst({
      where: {
        storeId,
        documentNumber,
      },
    });

    return found ? Sale.fromPersistence({
      ...found,
      documentNumber: found.documentNumber || undefined,
      notes: found.notes || undefined,
      documentType: found.documentType as any,
      status: found.status as any,
    }) : null;
  }

  async findByFilters(filters: SaleQueryFilters): Promise<Sale[]> {
    const where: any = {};

    if (filters.storeId) where.storeId = filters.storeId;
    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.status) where.status = filters.status;
    if (filters.documentType) where.documentType = filters.documentType;
    if (filters.documentNumber) where.documentNumber = { contains: filters.documentNumber };
    if (filters.series) where.series = filters.series;
    
    if (filters.startDate || filters.endDate) {
      where.saleDate = {};
      if (filters.startDate) where.saleDate.gte = filters.startDate;
      if (filters.endDate) where.saleDate.lte = filters.endDate;
    }

    const orderBy: any = {};
    if (filters.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.saleDate = 'desc';
    }

    const sales = await this.prisma.sale.findMany({
      where,
      orderBy,
      skip: filters.offset,
      take: filters.limit,
    });

    return sales.map(sale => Sale.fromPersistence({
      ...sale,
      documentNumber: sale.documentNumber || undefined,
      notes: sale.notes || undefined,
      documentType: sale.documentType as any,
      status: sale.status as any,
    }));
  }

  async countByFilters(filters: SaleQueryFilters): Promise<number> {
    const where: any = {};

    if (filters.storeId) where.storeId = filters.storeId;
    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.userId) where.userId = filters.userId;
    if (filters.status) where.status = filters.status;
    if (filters.documentType) where.documentType = filters.documentType;
    if (filters.documentNumber) where.documentNumber = { contains: filters.documentNumber };
    if (filters.series) where.series = filters.series;
    
    if (filters.startDate || filters.endDate) {
      where.saleDate = {};
      if (filters.startDate) where.saleDate.gte = filters.startDate;
      if (filters.endDate) where.saleDate.lte = filters.endDate;
    }

    return this.prisma.sale.count({ where });
  }

  async save(sale: Sale): Promise<Sale> {
    return this.create(sale);
  }

  async update(sale: Sale): Promise<Sale> {
    const updated = await this.prisma.sale.update({
      where: { id: sale.id },
      data: {
        documentNumber: sale.documentNumber,
        subtotal: sale.subtotal,
        tax: sale.tax,
        discount: sale.discount,
        total: sale.total,
        status: sale.status,
        notes: sale.notes,
        updatedAt: new Date(),
      },
    });

    return Sale.fromPersistence({
      ...updated,
      documentNumber: updated.documentNumber || undefined,
      notes: updated.notes || undefined,
      documentType: updated.documentType as any,
      status: updated.status as any,
    });
  }

  async updateWithTransaction(sale: Sale, tx?: any): Promise<Sale> {
    const prisma = tx || this.prisma;
    const updated = await prisma.sale.update({
      where: { id: sale.id },
      data: {
        documentNumber: sale.documentNumber,
        subtotal: sale.subtotal,
        tax: sale.tax,
        discount: sale.discount,
        total: sale.total,
        status: sale.status,
        notes: sale.notes,
        updatedAt: new Date(),
      },
    });

    return Sale.fromPersistence({
      ...updated,
      documentNumber: updated.documentNumber || undefined,
      notes: updated.notes || undefined,
      documentType: updated.documentType as any,
      status: updated.status as any,
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

  async existsByStoreAndDocument(storeId: string, documentNumber: string): Promise<boolean> {
    const count = await this.prisma.sale.count({
      where: { storeId, documentNumber },
    });
    return count > 0;
  }

  async getNextDocumentNumber(storeId: string, documentType: string, series: string): Promise<string> {
    // Obtener el siguiente número de la serie
    const voucherSeries = await this.prisma.voucherSeries.findFirst({
      where: {
        storeId,
        voucherType: documentType as any,
        series,
      },
    });

    if (!voucherSeries) {
      throw new Error(`Serie ${series} no encontrada para el tipo ${documentType} en la tienda ${storeId}`);
    }

    const nextNumber = voucherSeries.currentNumber;
    return `${series}-${nextNumber.toString().padStart(8, '0')}`;
  }

  async incrementDocumentNumber(storeId: string, documentType: string, series: string, tx?: any): Promise<void> {
    const prisma = tx || this.prisma;
    
    await prisma.voucherSeries.updateMany({
      where: {
        storeId,
        voucherType: documentType as any,
        series,
      },
      data: {
        currentNumber: {
          increment: 1,
        },
      },
    });
  }

  async getTotalSalesByDateRange(
    startDate: Date,
    endDate: Date,
    storeId: string | null,
    status?: string
  ): Promise<number> {
    const where: any = {
      saleDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (storeId) {
      where.storeId = storeId;
    }

    if (status) {
      where.status = status;
    }

    const result = await this.prisma.sale.aggregate({
      where,
      _sum: {
        total: true,
      },
    });

    return Number(result._sum.total) || 0;
  }

  async countSalesByDateRange(
    startDate: Date,
    endDate: Date,
    storeId: string | null,
    status?: string
  ): Promise<number> {
    const where: any = {
      saleDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (storeId) {
      where.storeId = storeId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.sale.count({ where });
  }
}
