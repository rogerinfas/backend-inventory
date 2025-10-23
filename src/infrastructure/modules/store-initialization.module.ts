import { Module } from '@nestjs/common';
import { StoreInitializationService } from '../../application/services/store-initialization.service';
import { CreateStoreUseCase } from '../../application/use-cases/store/create-store.use-case';
import { CreateUserWithPersonUseCase } from '../../application/use-cases/user/create-user-with-person.use-case';
import { StorePrismaRepository } from '../repositories/store.repository';
import { UserPrismaRepository } from '../repositories/user.repository';
import { PersonPrismaRepository } from '../repositories/person.repository';
import { StoreRepository } from '../../domain/repositories/store.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PersonRepository } from '../../domain/repositories/person.repository';
import { DatabaseModule } from './database.module';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    StoreInitializationService,
    PrismaService,
    StorePrismaRepository,
    UserPrismaRepository,
    PersonPrismaRepository,
    {
      provide: 'StoreRepository',
      useClass: StorePrismaRepository,
    },
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
    {
      provide: 'PersonRepository',
      useClass: PersonPrismaRepository,
    },
    // Inyección específica para CreateStoreUseCase
    {
      provide: CreateStoreUseCase,
      useFactory: (storeRepository: StoreRepository) => {
        return new CreateStoreUseCase(storeRepository);
      },
      inject: ['StoreRepository'],
    },
    // Inyección específica para CreateUserWithPersonUseCase
    {
      provide: CreateUserWithPersonUseCase,
      useFactory: (
        personRepository: PersonRepository,
        userRepository: UserRepository,
        storeRepository: StoreRepository,
        prismaService: PrismaService,
      ) => {
        return new CreateUserWithPersonUseCase(
          personRepository,
          userRepository,
          storeRepository,
          prismaService,
        );
      },
      inject: [
        'PersonRepository',
        'UserRepository',
        'StoreRepository',
        PrismaService,
      ],
    },
  ],
  exports: [StoreInitializationService],
})
export class StoreInitializationModule {}
