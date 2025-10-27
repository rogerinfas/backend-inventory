import { Injectable, Inject } from '@nestjs/common';
import { Brand } from '../../../domain/entities/brand.entity';
import { CreateBrandDto, BrandResponseDto } from '../../dto/brand';
import type { BrandRepository } from '../../../domain/repositories';
import { BrandMapper } from '../../mappers';
import { BrandAlreadyExistsError } from '../../errors';

@Injectable()
export class CreateBrandUseCase {
  constructor(
    @Inject('BrandRepository')
    private readonly brandRepository: BrandRepository
  ) {}

  async execute(dto: CreateBrandDto): Promise<BrandResponseDto> {
    // Verificar que no exista otra marca con el mismo nombre
    const existingBrand = await this.brandRepository.findByName(dto.name);
    if (existingBrand) {
      throw new BrandAlreadyExistsError('nombre', dto.name);
    }

    // Generar ID único
    const id = crypto.randomUUID();

    // Crear la entidad Brand
    const brand = BrandMapper.toDomain(dto, id);

    // Guardar en el repositorio
    const savedBrand = await this.brandRepository.save(brand);

    // Retornar DTO de respuesta
    return BrandMapper.toResponseDto(savedBrand);
  }
}
