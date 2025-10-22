import { Module } from '@nestjs/common';
import { AdminInitializationService } from '../../application/services/admin-initialization.service';
import { CreateGeneralAdminUseCase } from '../../application/use-cases/create-general-admin.use-case';
import { UserPrismaRepository } from '../repositories/user.repository';
import { PersonPrismaRepository } from '../repositories/person.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PersonRepository } from '../../domain/repositories/person.repository';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    AdminInitializationService,
    CreateGeneralAdminUseCase,
    UserPrismaRepository,
    PersonPrismaRepository,
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
    {
      provide: 'PersonRepository',
      useClass: PersonPrismaRepository,
    },
  ],
  exports: [AdminInitializationService],
})
export class AdminInitializationModule {}
