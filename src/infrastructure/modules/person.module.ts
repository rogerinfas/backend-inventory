import { Module } from '@nestjs/common';
import { PersonController } from '../controllers/person.controller';
import { PersonService } from '../../application/services/person.service';
import { PersonPrismaRepository } from '../repositories/person.repository';
import { PrismaService } from '../database/prisma.service';
import { PersonRepository } from '../../domain/repositories';

@Module({
  controllers: [PersonController],
  providers: [
    PersonService,
    PrismaService,
    {
      provide: 'PersonRepository',
      useClass: PersonPrismaRepository,
    },
  ],
  exports: [PersonService, 'PersonRepository'],
})
export class PersonModule {}
