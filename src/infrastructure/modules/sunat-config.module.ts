import { Module } from '@nestjs/common';
import { SunatConfigController } from '../controllers/sunat-config.controller';
import { SunatConfigService } from '../../application/services/sunat-config.service';
import { SunatConfigPrismaRepository } from '../repositories/sunat-config.repository';
import { StorePrismaRepository } from '../repositories/store.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [SunatConfigController],
  providers: [
    SunatConfigService,
    PrismaService,
    {
      provide: 'SunatConfigRepository',
      useClass: SunatConfigPrismaRepository,
    },
    {
      provide: 'StoreRepository',
      useClass: StorePrismaRepository,
    },
  ],
  exports: [SunatConfigService, 'SunatConfigRepository'],
})
export class SunatConfigModule {}
