import { Injectable, Inject } from '@nestjs/common';
import type { BrandRepository } from '../../domain/repositories';
import {
  CreateBrandDto,
  UpdateBrandDto,
  BrandResponseDto,
  BrandQueryDto,
  ChangeBrandStatusDto,
} from '../dto/brand';
import {
  CreateBrandUseCase,
  UpdateBrandUseCase,
  GetBrandByIdUseCase,
  ListBrandsUseCase,
  ChangeBrandStatusUseCase,
  DeleteBrandUseCase,
  ListBrandsResult,
} from '../use-cases/brand';

@Injectable()
export class BrandService {
  private readonly createBrandUseCase: CreateBrandUseCase;
  private readonly updateBrandUseCase: UpdateBrandUseCase;
  private readonly getBrandByIdUseCase: GetBrandByIdUseCase;
  private readonly listBrandsUseCase: ListBrandsUseCase;
  private readonly changeBrandStatusUseCase: ChangeBrandStatusUseCase;
  private readonly deleteBrandUseCase: DeleteBrandUseCase;

  constructor(@Inject('BrandRepository') brandRepository: BrandRepository) {
    this.createBrandUseCase = new CreateBrandUseCase(brandRepository);
    this.updateBrandUseCase = new UpdateBrandUseCase(brandRepository);
    this.getBrandByIdUseCase = new GetBrandByIdUseCase(brandRepository);
    this.listBrandsUseCase = new ListBrandsUseCase(brandRepository);
    this.changeBrandStatusUseCase = new ChangeBrandStatusUseCase(brandRepository);
    this.deleteBrandUseCase = new DeleteBrandUseCase(brandRepository);
  }

  async createBrand(dto: CreateBrandDto): Promise<BrandResponseDto> {
    return this.createBrandUseCase.execute(dto);
  }

  async updateBrand(id: string, dto: UpdateBrandDto): Promise<BrandResponseDto> {
    return this.updateBrandUseCase.execute(id, dto);
  }

  async getBrandById(id: string): Promise<BrandResponseDto | null> {
    return this.getBrandByIdUseCase.execute(id);
  }

  async listBrands(query: BrandQueryDto): Promise<ListBrandsResult> {
    return this.listBrandsUseCase.execute(query);
  }

  async changeBrandStatus(id: string, dto: ChangeBrandStatusDto): Promise<BrandResponseDto> {
    return this.changeBrandStatusUseCase.execute(id, dto);
  }

  async deleteBrand(id: string): Promise<BrandResponseDto> {
    return this.deleteBrandUseCase.execute(id);
  }
}
