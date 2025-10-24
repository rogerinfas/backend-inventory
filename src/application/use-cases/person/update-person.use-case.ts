import { Person } from '../../../domain/entities/person.entity';
import { UpdatePersonDto, PersonResponseDto } from '../../dto/person';
import { PersonRepository } from '../../../domain/repositories';
import { PersonMapper } from '../../mappers';
import { PersonNotFoundError, PersonAlreadyExistsError, PersonDeletedError } from '../../errors';

export class UpdatePersonUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute(id: string, dto: UpdatePersonDto): Promise<PersonResponseDto> {
    // Buscar la persona existente
    const existingPerson = await this.personRepository.findById(id);
    if (!existingPerson) {
      throw new PersonNotFoundError(id);
    }

    // Verificar que no esté eliminada
    if (existingPerson.isDeleted()) {
      throw new PersonDeletedError(id);
    }


    // Aplicar las actualizaciones
    const updatedPerson = PersonMapper.toUpdateDomain(dto, existingPerson);

    // Guardar los cambios
    const savedPerson = await this.personRepository.update(updatedPerson);

    // Retornar DTO de respuesta
    return PersonMapper.toResponseDto(savedPerson);
  }
}
