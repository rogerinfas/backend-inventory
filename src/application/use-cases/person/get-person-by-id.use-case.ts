import { PersonResponseDto } from '../../dto/person';
import { PersonRepository } from '../../../domain/repositories';
import { PersonMapper } from '../../mappers';

export class GetPersonByIdUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute(id: string): Promise<PersonResponseDto | null> {
    const person = await this.personRepository.findById(id);
    
    if (!person) {
      return null;
    }

    return PersonMapper.toResponseDto(person);
  }
}
