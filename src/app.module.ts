import { Module } from '@nestjs/common';
import { PersonModule } from './infrastructure/modules/person.module';
import { StoreModule } from './infrastructure/modules/store.module';
import { DatabaseModule } from './infrastructure/modules/database.module';

@Module({
  imports: [DatabaseModule, PersonModule, StoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
