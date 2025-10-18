import { StoreRepository } from '../../../domain/repositories/store.repository';
import { CreateStoreDto, StoreResponseDto } from '../../dto/store';
import { StoreMapper } from '../../mappers/store.mapper';
import { StoreAlreadyExistsError } from '../../errors/domain-errors';

export class CreateStoreUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  async execute(dto: CreateStoreDto): Promise<StoreResponseDto> {
    // 1. Verificar unicidad de RUC
    const existingStoreByRuc = await this.storeRepository.findByRuc(dto.ruc);
    if (existingStoreByRuc) {
      throw new StoreAlreadyExistsError('RUC', dto.ruc);
    }

    // 2. Verificar unicidad de email (si se proporciona)
    if (dto.email) {
      const existingStoreByEmail = await this.storeRepository.findByEmail(dto.email);
      if (existingStoreByEmail) {
        throw new StoreAlreadyExistsError('email', dto.email);
      }
    }

    // 3. Crear entidad
    const id = crypto.randomUUID();
    const store = StoreMapper.toDomain(dto, id);

    // 4. Guardar
    const savedStore = await this.storeRepository.save(store);

    // 5. Retornar DTO
    return StoreMapper.toResponseDto(savedStore);
  }
}
