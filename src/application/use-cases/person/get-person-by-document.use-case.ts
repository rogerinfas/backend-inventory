import { PersonResponseDto } from '../../dto/person';
import { PersonRepository } from '../../../domain/repositories';
import { PersonMapper } from '../../mappers';

export class GetPersonByDocumentUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute(documentNumber: string): Promise<PersonResponseDto | null> {
    const person = await this.personRepository.findByDocumentNumber(documentNumber);
    
    if (!person) {
      return null;
    }

    return PersonMapper.toResponseDto(person);
  }
}
