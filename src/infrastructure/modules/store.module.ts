import { Module } from '@nestjs/common';
import { StoreController } from '../controllers/store.controller';
import { StoreService } from '../../application/services/store.service';
import { StorePrismaRepository } from '../repositories/store.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [StoreController],
  providers: [
    StoreService,
    PrismaService,
    {
      provide: 'StoreRepository',
      useClass: StorePrismaRepository,
    },
  ],
  exports: [StoreService, 'StoreRepository'],
})
export class StoreModule {}
