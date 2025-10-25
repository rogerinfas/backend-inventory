import { Module, OnModuleInit } from '@nestjs/common';
import { DataInitializationService } from '../../application/services/data-initialization.service';
import { CreateUserWithPersonUseCase } from '../../application/use-cases/user/create-user-with-person.use-case';
import { UserPrismaRepository } from '../repositories/user.repository';
import { PersonPrismaRepository } from '../repositories/person.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PersonRepository } from '../../domain/repositories/person.repository';
import { DatabaseModule } from './database.module';
import { StorePrismaRepository } from '../repositories/store.repository';
import { StoreRepository } from '../../domain/repositories/store.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    DataInitializationService,
    CreateUserWithPersonUseCase,
    UserPrismaRepository,
    PersonPrismaRepository,
    StorePrismaRepository,
    PrismaService,
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
    {
      provide: 'PersonRepository',
      useClass: PersonPrismaRepository,
    },
    {
      provide: 'StoreRepository',
      useClass: StorePrismaRepository,
    },
  ],
  exports: [DataInitializationService],
})
export class DataInitializationModule implements OnModuleInit {
  constructor(
    private readonly dataInitializationService: DataInitializationService,
  ) {}

  async onModuleInit() {
    // Initialize superadmin when the module is loaded
    await this.dataInitializationService.initializeSuperadmin();
  }
}
