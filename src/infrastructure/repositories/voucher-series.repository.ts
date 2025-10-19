import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { VoucherSeries } from '../../domain/entities/voucher-series.entity';
import { VoucherSeriesRepository, VoucherSeriesQueryFilters } from '../../domain/repositories/voucher-series.repository';
import { VoucherType } from '../../domain/enums/voucher-type.enum';
import { VoucherType as PrismaVoucherType } from '@prisma/client';

@Injectable()
export class VoucherSeriesPrismaRepository implements VoucherSeriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<VoucherSeries | null> {
    const voucherSeriesData = await this.prisma.voucherSeries.findUnique({
      where: { id },
    });

    if (!voucherSeriesData) {
      return null;
    }

    return VoucherSeries.fromPersistence(
      voucherSeriesData.id,
      voucherSeriesData.storeId,
      voucherSeriesData.voucherType as VoucherType,
      voucherSeriesData.series,
      voucherSeriesData.currentNumber,
      voucherSeriesData.createdAt,
      voucherSeriesData.updatedAt
    );
  }

  async findByStoreAndType(storeId: string, voucherType: VoucherType): Promise<VoucherSeries[]> {
    const voucherSeriesData = await this.prisma.voucherSeries.findMany({
      where: { 
        storeId,
        voucherType: voucherType as PrismaVoucherType
      },
    });

    return voucherSeriesData.map(data =>
      VoucherSeries.fromPersistence(
        data.id,
        data.storeId,
        data.voucherType as VoucherType,
        data.series,
        data.currentNumber,
        data.createdAt,
        data.updatedAt
      )
    );
  }

  async findByStoreTypeAndSeries(storeId: string, voucherType: VoucherType, series: string): Promise<VoucherSeries | null> {
    const voucherSeriesData = await this.prisma.voucherSeries.findFirst({
      where: { 
        storeId,
        voucherType: voucherType as PrismaVoucherType,
        series
      },
    });

    if (!voucherSeriesData) {
      return null;
    }

    return VoucherSeries.fromPersistence(
      voucherSeriesData.id,
      voucherSeriesData.storeId,
      voucherSeriesData.voucherType as VoucherType,
      voucherSeriesData.series,
      voucherSeriesData.currentNumber,
      voucherSeriesData.createdAt,
      voucherSeriesData.updatedAt
    );
  }

  async findMany(filters: VoucherSeriesQueryFilters): Promise<VoucherSeries[]> {
    const where: any = {};

    if (filters.storeId) {
      where.storeId = filters.storeId;
    }

    if (filters.voucherType) {
      where.voucherType = filters.voucherType as PrismaVoucherType;
    }

    if (filters.series) {
      where.series = {
        contains: filters.series,
        mode: 'insensitive'
      };
    }

    const voucherSeriesData = await this.prisma.voucherSeries.findMany({
      where,
      skip: filters.offset || 0,
      take: filters.limit || 10,
      orderBy: {
        [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc',
      },
    });

    return voucherSeriesData.map(data =>
      VoucherSeries.fromPersistence(
        data.id,
        data.storeId,
        data.voucherType as VoucherType,
        data.series,
        data.currentNumber,
        data.createdAt,
        data.updatedAt
      )
    );
  }

  async save(voucherSeries: VoucherSeries): Promise<VoucherSeries> {
    const voucherSeriesData = await this.prisma.voucherSeries.create({
      data: {
        id: voucherSeries.id,
        storeId: voucherSeries.storeId,
        voucherType: voucherSeries.voucherType as PrismaVoucherType,
        series: voucherSeries.series,
        currentNumber: voucherSeries.currentNumber,
        createdAt: voucherSeries.createdAt,
        updatedAt: voucherSeries.updatedAt,
      },
    });

    return VoucherSeries.fromPersistence(
      voucherSeriesData.id,
      voucherSeriesData.storeId,
      voucherSeriesData.voucherType as VoucherType,
      voucherSeriesData.series,
      voucherSeriesData.currentNumber,
      voucherSeriesData.createdAt,
      voucherSeriesData.updatedAt
    );
  }

  async update(voucherSeries: VoucherSeries): Promise<VoucherSeries> {
    const voucherSeriesData = await this.prisma.voucherSeries.update({
      where: { id: voucherSeries.id },
      data: {
        voucherType: voucherSeries.voucherType as PrismaVoucherType,
        series: voucherSeries.series,
        currentNumber: voucherSeries.currentNumber,
        updatedAt: voucherSeries.updatedAt,
      },
    });

    return VoucherSeries.fromPersistence(
      voucherSeriesData.id,
      voucherSeriesData.storeId,
      voucherSeriesData.voucherType as VoucherType,
      voucherSeriesData.series,
      voucherSeriesData.currentNumber,
      voucherSeriesData.createdAt,
      voucherSeriesData.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.voucherSeries.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.voucherSeries.count({
      where: { id },
    });
    return count > 0;
  }

  async count(filters: VoucherSeriesQueryFilters): Promise<number> {
    const where: any = {};

    if (filters.storeId) {
      where.storeId = filters.storeId;
    }

    if (filters.voucherType) {
      where.voucherType = filters.voucherType as PrismaVoucherType;
    }

    if (filters.series) {
      where.series = {
        contains: filters.series,
        mode: 'insensitive'
      };
    }

    return this.prisma.voucherSeries.count({ where });
  }
}
