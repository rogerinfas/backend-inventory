import { Module } from '@nestjs/common';
import { PersonModule } from './infrastructure/modules/person.module';
import { DatabaseModule } from './infrastructure/modules/database.module';

@Module({
  imports: [DatabaseModule, PersonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
