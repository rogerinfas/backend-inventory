import { Injectable } from '@nestjs/common';
import type { SunatConfigRepository, StoreRepository } from '../../../domain/repositories';
import { CreateSunatConfigDto, SunatConfigResponseDto } from '../../dto/sunat-config';
import { SunatConfigMapper } from '../../mappers/sunat-config.mapper';
import { 
  SunatConfigAlreadyExistsError, 
  StoreNotFoundError,
  InvalidSunatCredentialsError 
} from '../../errors/domain-errors';

@Injectable()
export class CreateSunatConfigUseCase {
  constructor(
    private readonly sunatConfigRepository: SunatConfigRepository,
    private readonly storeRepository: StoreRepository,
  ) {}

  async execute(dto: CreateSunatConfigDto): Promise<SunatConfigResponseDto> {
    // 1. Verificar que la tienda existe
    const store = await this.storeRepository.findById(dto.storeId);
    if (!store) {
      throw new StoreNotFoundError(dto.storeId);
    }

    // 2. Verificar que no exista configuración SUNAT para esta tienda
    const existingConfig = await this.sunatConfigRepository.findByStoreId(dto.storeId);
    if (existingConfig) {
      throw new SunatConfigAlreadyExistsError(dto.storeId);
    }

    // 3. Validar credenciales SOL
    if (!dto.solUsername || !dto.solPassword) {
      throw new InvalidSunatCredentialsError('Usuario y contraseña SOL son requeridos');
    }

    // 4. Crear entidad
    const id = crypto.randomUUID();
    const sunatConfig = SunatConfigMapper.toDomain(dto, id);

    // 5. Guardar
    const savedSunatConfig = await this.sunatConfigRepository.save(sunatConfig);

    // 6. Retornar DTO
    return SunatConfigMapper.toResponseDto(savedSunatConfig);
  }
}
