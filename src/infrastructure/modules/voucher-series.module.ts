import { Module } from '@nestjs/common';
import { VoucherSeriesController } from '../controllers/voucher-series.controller';
import { VoucherSeriesService } from '../../application/services/voucher-series.service';
import { VoucherSeriesPrismaRepository } from '../repositories/voucher-series.repository';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [VoucherSeriesController],
  providers: [
    {
      provide: 'VoucherSeriesRepository',
      useClass: VoucherSeriesPrismaRepository,
    },
    VoucherSeriesService,
  ],
  exports: [VoucherSeriesService],
})
export class VoucherSeriesModule {}
