import { PersonResponseDto } from '../../dto/person';
import { PersonRepository } from '../../../domain/repositories';
import { PersonMapper } from '../../mappers';
import { PersonNotFoundError, PersonDeletedError } from '../../errors';

export class DeletePersonUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute(id: string): Promise<PersonResponseDto> {
    // Buscar la persona existente
    const existingPerson = await this.personRepository.findById(id);
    if (!existingPerson) {
      throw new PersonNotFoundError(id);
    }

    // Verificar que no esté ya eliminada
    if (existingPerson.isDeleted()) {
      throw new PersonDeletedError(id);
    }

    // Aplicar soft delete
    existingPerson.delete();

    // Guardar los cambios
    const savedPerson = await this.personRepository.update(existingPerson);

    // Retornar DTO de respuesta
    return PersonMapper.toResponseDto(savedPerson);
  }
}
