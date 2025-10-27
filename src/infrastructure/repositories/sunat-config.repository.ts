import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SunatConfigRepository, SunatConfigQueryFilters } from '../../domain/repositories';
import { SunatConfig } from '../../domain/entities/sunat-config.entity';
import { SunatEnvironment } from '../../domain/enums/sunat-environment.enum';

@Injectable()
export class SunatConfigPrismaRepository implements SunatConfigRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<SunatConfig | null> {
    const sunatConfigData = await this.prisma.sunatConfig.findUnique({
      where: { id },
    });

    if (!sunatConfigData) {
      return null;
    }

    return SunatConfig.fromPersistence(
      sunatConfigData.id,
      sunatConfigData.storeId,
      sunatConfigData.solUsername,
      sunatConfigData.solPassword,
      sunatConfigData.digitalCertificate ? Buffer.from(sunatConfigData.digitalCertificate) : null,
      sunatConfigData.certificatePassword,
      sunatConfigData.apiUrl,
      sunatConfigData.environment as SunatEnvironment,
      sunatConfigData.createdAt,
      sunatConfigData.updatedAt
    );
  }

  async findByStoreId(storeId: string): Promise<SunatConfig | null> {
    const sunatConfigData = await this.prisma.sunatConfig.findUnique({
      where: { storeId },
    });

    if (!sunatConfigData) {
      return null;
    }

    return SunatConfig.fromPersistence(
      sunatConfigData.id,
      sunatConfigData.storeId,
      sunatConfigData.solUsername,
      sunatConfigData.solPassword,
      sunatConfigData.digitalCertificate ? Buffer.from(sunatConfigData.digitalCertificate) : null,
      sunatConfigData.certificatePassword,
      sunatConfigData.apiUrl,
      sunatConfigData.environment as SunatEnvironment,
      sunatConfigData.createdAt,
      sunatConfigData.updatedAt
    );
  }

  async findMany(filters: SunatConfigQueryFilters = {}): Promise<SunatConfig[]> {
    const where: any = {};

    if (filters.storeId) {
      where.storeId = filters.storeId;
    }

    if (filters.environment) {
      where.environment = filters.environment;
    }

    const sunatConfigsData = await this.prisma.sunatConfig.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sunatConfigsData.map(sunatConfigData =>
      SunatConfig.fromPersistence(
        sunatConfigData.id,
        sunatConfigData.storeId,
        sunatConfigData.solUsername,
        sunatConfigData.solPassword,
        sunatConfigData.digitalCertificate ? Buffer.from(sunatConfigData.digitalCertificate) : null,
        sunatConfigData.certificatePassword,
        sunatConfigData.apiUrl,
        sunatConfigData.environment as SunatEnvironment,
        sunatConfigData.createdAt,
        sunatConfigData.updatedAt
      )
    );
  }

  async save(sunatConfig: SunatConfig): Promise<SunatConfig> {
    const sunatConfigData = await this.prisma.sunatConfig.create({
      data: {
        id: sunatConfig.id,
        storeId: sunatConfig.storeId,
        solUsername: sunatConfig.solUsername,
        solPassword: sunatConfig.solPassword,
        digitalCertificate: null,
        certificatePassword: sunatConfig.certificatePassword,
        apiUrl: sunatConfig.apiUrl,
        environment: sunatConfig.environment,
        createdAt: sunatConfig.createdAt,
        updatedAt: sunatConfig.updatedAt,
      },
    });

    return SunatConfig.fromPersistence(
      sunatConfigData.id,
      sunatConfigData.storeId,
      sunatConfigData.solUsername,
      sunatConfigData.solPassword,
      sunatConfigData.digitalCertificate ? Buffer.from(sunatConfigData.digitalCertificate) : null,
      sunatConfigData.certificatePassword,
      sunatConfigData.apiUrl,
      sunatConfigData.environment as SunatEnvironment,
      sunatConfigData.createdAt,
      sunatConfigData.updatedAt
    );
  }

  async update(sunatConfig: SunatConfig): Promise<SunatConfig> {
    const sunatConfigData = await this.prisma.sunatConfig.update({
      where: { id: sunatConfig.id },
      data: {
        solUsername: sunatConfig.solUsername,
        solPassword: sunatConfig.solPassword,
        digitalCertificate: null,
        certificatePassword: sunatConfig.certificatePassword,
        apiUrl: sunatConfig.apiUrl,
        environment: sunatConfig.environment,
        updatedAt: sunatConfig.updatedAt,
      },
    });

    return SunatConfig.fromPersistence(
      sunatConfigData.id,
      sunatConfigData.storeId,
      sunatConfigData.solUsername,
      sunatConfigData.solPassword,
      sunatConfigData.digitalCertificate ? Buffer.from(sunatConfigData.digitalCertificate) : null,
      sunatConfigData.certificatePassword,
      sunatConfigData.apiUrl,
      sunatConfigData.environment as SunatEnvironment,
      sunatConfigData.createdAt,
      sunatConfigData.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.sunatConfig.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.sunatConfig.count({
      where: { id },
    });
    return count > 0;
  }

  async existsByStoreId(storeId: string): Promise<boolean> {
    const count = await this.prisma.sunatConfig.count({
      where: { storeId },
    });
    return count > 0;
  }

  async count(filters: SunatConfigQueryFilters = {}): Promise<number> {
    const where: any = {};

    if (filters.storeId) {
      where.storeId = filters.storeId;
    }

    if (filters.environment) {
      where.environment = filters.environment;
    }

    return this.prisma.sunatConfig.count({ where });
  }
}
