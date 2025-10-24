import { Person } from '../../../domain/entities/person.entity';
import { CreatePersonDto, PersonResponseDto } from '../../dto/person';
import { PersonRepository } from '../../../domain/repositories';
import { PersonMapper } from '../../mappers';
import { PersonAlreadyExistsError } from '../../errors';

export class CreatePersonUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute(dto: CreatePersonDto): Promise<PersonResponseDto> {
    // Verificar que no exista otra persona con el mismo documento
    const existingPerson = await this.personRepository.findByDocumentNumber(dto.documentNumber);
    if (existingPerson) {
      throw new PersonAlreadyExistsError('número de documento', dto.documentNumber);
    }


    // Generar ID único
    const id = crypto.randomUUID();

    // Crear la entidad Person
    const person = PersonMapper.toDomain(dto, id);

    // Guardar en el repositorio
    const savedPerson = await this.personRepository.save(person);

    // Retornar DTO de respuesta
    return PersonMapper.toResponseDto(savedPerson);
  }
}
