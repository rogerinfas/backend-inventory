import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../../application/services/user.service';
import { UserPrismaRepository } from '../repositories/user.repository';
import { PersonPrismaRepository } from '../repositories/person.repository';
import { StorePrismaRepository } from '../repositories/store.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
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
  exports: [UserService, 'UserRepository', 'PersonRepository', 'StoreRepository'],
})
export class UserModule {}
