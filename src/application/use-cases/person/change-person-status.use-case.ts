import { Person } from '../../../domain/entities/person.entity';
import { ChangePersonStatusDto, PersonResponseDto } from '../../dto/person';
import { PersonRepository } from '../../../domain/repositories';
import { PersonMapper } from '../../mappers';
import { PersonNotFoundError, InvalidStatusChangeError } from '../../errors';

export class ChangePersonStatusUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute(id: string, dto: ChangePersonStatusDto): Promise<PersonResponseDto> {
    // Buscar la persona existente
    const existingPerson = await this.personRepository.findById(id);
    if (!existingPerson) {
      throw new PersonNotFoundError(id);
    }

    // Aplicar el cambio de estado según el tipo
    switch (dto.status) {
      case 'ACTIVE':
        existingPerson.activate();
        break;
      case 'INACTIVE':
        existingPerson.deactivate();
        break;
      case 'SUSPENDED':
        existingPerson.suspend();
        break;
      case 'DELETED':
        existingPerson.delete();
        break;
      default:
        throw new Error('Estado no válido');
    }

    // Guardar los cambios
    const savedPerson = await this.personRepository.update(existingPerson);

    // Retornar DTO de respuesta
    return PersonMapper.toResponseDto(savedPerson);
  }
}
