import type { StoreRepository } from '../../domain/repositories';
import { Inject } from '@nestjs/common';
import {
  CreateStoreDto,
  UpdateStoreDto,
  StoreResponseDto,
  StoreQueryDto,
  ChangeStoreStatusDto,
} from '../dto/store';
import {
  CreateStoreUseCase,
  UpdateStoreUseCase,
  GetStoreByIdUseCase,
  GetStoreByRucUseCase,
  ListStoresUseCase,
  ChangeStoreStatusUseCase,
  DeleteStoreUseCase,
  ListStoresResult,
} from '../use-cases/store';

export class StoreService {
  private readonly createStoreUseCase: CreateStoreUseCase;
  private readonly updateStoreUseCase: UpdateStoreUseCase;
  private readonly getStoreByIdUseCase: GetStoreByIdUseCase;
  private readonly getStoreByRucUseCase: GetStoreByRucUseCase;
  private readonly listStoresUseCase: ListStoresUseCase;
  private readonly changeStoreStatusUseCase: ChangeStoreStatusUseCase;
  private readonly deleteStoreUseCase: DeleteStoreUseCase;

  constructor(@Inject('StoreRepository') storeRepository: StoreRepository) {
    this.createStoreUseCase = new CreateStoreUseCase(storeRepository);
    this.updateStoreUseCase = new UpdateStoreUseCase(storeRepository);
    this.getStoreByIdUseCase = new GetStoreByIdUseCase(storeRepository);
    this.getStoreByRucUseCase = new GetStoreByRucUseCase(storeRepository);
    this.listStoresUseCase = new ListStoresUseCase(storeRepository);
    this.changeStoreStatusUseCase = new ChangeStoreStatusUseCase(storeRepository);
    this.deleteStoreUseCase = new DeleteStoreUseCase(storeRepository);
  }

  async createStore(dto: CreateStoreDto): Promise<StoreResponseDto> {
    return this.createStoreUseCase.execute(dto);
  }

  async updateStore(id: string, dto: UpdateStoreDto): Promise<StoreResponseDto> {
    return this.updateStoreUseCase.execute(id, dto);
  }

  async getStoreById(id: string): Promise<StoreResponseDto | null> {
    return this.getStoreByIdUseCase.execute(id);
  }

  async getStoreByRuc(ruc: string): Promise<StoreResponseDto | null> {
    return this.getStoreByRucUseCase.execute(ruc);
  }

  async listStores(query: StoreQueryDto): Promise<ListStoresResult> {
    return this.listStoresUseCase.execute(query);
  }

  async changeStoreStatus(id: string, dto: ChangeStoreStatusDto): Promise<StoreResponseDto> {
    return this.changeStoreStatusUseCase.execute(id, dto);
  }

  async deleteStore(id: string): Promise<StoreResponseDto> {
    return this.deleteStoreUseCase.execute(id);
  }
}
