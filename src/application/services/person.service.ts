import type { PersonRepository } from '../../domain/repositories';
import { Inject } from '@nestjs/common';
import {
  CreatePersonDto,
  UpdatePersonDto,
  PersonResponseDto,
  PersonQueryDto,
  ChangePersonStatusDto,
} from '../dto/person';
import {
  CreatePersonUseCase,
  UpdatePersonUseCase,
  GetPersonByIdUseCase,
  GetPersonByDocumentUseCase,
  ListPersonsUseCase,
  ChangePersonStatusUseCase,
  DeletePersonUseCase,
  ListPersonsResult,
} from '../use-cases/person';

export class PersonService {
  private readonly createPersonUseCase: CreatePersonUseCase;
  private readonly updatePersonUseCase: UpdatePersonUseCase;
  private readonly getPersonByIdUseCase: GetPersonByIdUseCase;
  private readonly getPersonByDocumentUseCase: GetPersonByDocumentUseCase;
  private readonly listPersonsUseCase: ListPersonsUseCase;
  private readonly changePersonStatusUseCase: ChangePersonStatusUseCase;
  private readonly deletePersonUseCase: DeletePersonUseCase;

  constructor(@Inject('PersonRepository') personRepository: PersonRepository) {
    this.createPersonUseCase = new CreatePersonUseCase(personRepository);
    this.updatePersonUseCase = new UpdatePersonUseCase(personRepository);
    this.getPersonByIdUseCase = new GetPersonByIdUseCase(personRepository);
    this.getPersonByDocumentUseCase = new GetPersonByDocumentUseCase(personRepository);
    this.listPersonsUseCase = new ListPersonsUseCase(personRepository);
    this.changePersonStatusUseCase = new ChangePersonStatusUseCase(personRepository);
    this.deletePersonUseCase = new DeletePersonUseCase(personRepository);
  }

  async createPerson(dto: CreatePersonDto): Promise<PersonResponseDto> {
    return this.createPersonUseCase.execute(dto);
  }

  async updatePerson(id: string, dto: UpdatePersonDto): Promise<PersonResponseDto> {
    return this.updatePersonUseCase.execute(id, dto);
  }

  async getPersonById(id: string): Promise<PersonResponseDto | null> {
    return this.getPersonByIdUseCase.execute(id);
  }

  async getPersonByDocument(documentNumber: string): Promise<PersonResponseDto | null> {
    return this.getPersonByDocumentUseCase.execute(documentNumber);
  }

  async listPersons(query: PersonQueryDto): Promise<ListPersonsResult> {
    return this.listPersonsUseCase.execute(query);
  }

  async changePersonStatus(id: string, dto: ChangePersonStatusDto): Promise<PersonResponseDto> {
    return this.changePersonStatusUseCase.execute(id, dto);
  }

  async deletePerson(id: string): Promise<PersonResponseDto> {
    return this.deletePersonUseCase.execute(id);
  }
}
