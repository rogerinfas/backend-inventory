import { Injectable, Inject } from '@nestjs/common';
import type { SunatConfigRepository, StoreRepository } from '../../domain/repositories';
import {
  CreateSunatConfigDto,
  UpdateSunatConfigDto,
  SunatConfigResponseDto,
  SunatConfigQueryDto,
} from '../dto/sunat-config';
import {
  CreateSunatConfigUseCase,
  UpdateSunatConfigUseCase,
  GetSunatConfigByIdUseCase,
  GetSunatConfigByStoreIdUseCase,
  ListSunatConfigsUseCase,
  DeleteSunatConfigUseCase,
  ListSunatConfigsResult,
} from '../use-cases/sunat-config';

@Injectable()
export class SunatConfigService {
  private readonly createSunatConfigUseCase: CreateSunatConfigUseCase;
  private readonly updateSunatConfigUseCase: UpdateSunatConfigUseCase;
  private readonly getSunatConfigByIdUseCase: GetSunatConfigByIdUseCase;
  private readonly getSunatConfigByStoreIdUseCase: GetSunatConfigByStoreIdUseCase;
  private readonly listSunatConfigsUseCase: ListSunatConfigsUseCase;
  private readonly deleteSunatConfigUseCase: DeleteSunatConfigUseCase;

  constructor(
    @Inject('SunatConfigRepository') sunatConfigRepository: SunatConfigRepository,
    @Inject('StoreRepository') storeRepository: StoreRepository,
  ) {
    this.createSunatConfigUseCase = new CreateSunatConfigUseCase(
      sunatConfigRepository,
      storeRepository
    );
    this.updateSunatConfigUseCase = new UpdateSunatConfigUseCase(sunatConfigRepository);
    this.getSunatConfigByIdUseCase = new GetSunatConfigByIdUseCase(sunatConfigRepository);
    this.getSunatConfigByStoreIdUseCase = new GetSunatConfigByStoreIdUseCase(sunatConfigRepository);
    this.listSunatConfigsUseCase = new ListSunatConfigsUseCase(sunatConfigRepository);
    this.deleteSunatConfigUseCase = new DeleteSunatConfigUseCase(sunatConfigRepository);
  }

  async createSunatConfig(dto: CreateSunatConfigDto): Promise<SunatConfigResponseDto> {
    return this.createSunatConfigUseCase.execute(dto);
  }

  async updateSunatConfig(id: string, dto: UpdateSunatConfigDto): Promise<SunatConfigResponseDto> {
    return this.updateSunatConfigUseCase.execute(id, dto);
  }

  async getSunatConfigById(id: string): Promise<SunatConfigResponseDto | null> {
    return this.getSunatConfigByIdUseCase.execute(id);
  }

  async getSunatConfigByStoreId(storeId: string): Promise<SunatConfigResponseDto | null> {
    return this.getSunatConfigByStoreIdUseCase.execute(storeId);
  }

  async listSunatConfigs(query: SunatConfigQueryDto): Promise<ListSunatConfigsResult> {
    return this.listSunatConfigsUseCase.execute(query);
  }

  async deleteSunatConfig(id: string): Promise<void> {
    return this.deleteSunatConfigUseCase.execute(id);
  }
}
