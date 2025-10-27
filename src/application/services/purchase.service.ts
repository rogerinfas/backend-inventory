import { Injectable, Inject } from '@nestjs/common';
import type { PurchaseRepository, StoreRepository, SupplierRepository, UserRepository, ProductRepository } from '../../domain/repositories';
import type { StoreFilter } from '../../domain/value-objects';
import { 
  CreatePurchaseDto, 
  UpdatePurchaseDto, 
  PurchaseQueryDto, 
  PurchaseResponseDto 
} from '../dto/purchase';
import { ListPurchasesResult } from '../use-cases/purchase';

@Injectable()
export class PurchaseService {
  private readonly createPurchaseUseCase: any;
  private readonly updatePurchaseUseCase: any;
  private readonly getPurchaseByIdUseCase: any;
  private readonly listPurchasesUseCase: any;
  private readonly cancelPurchaseUseCase: any;
  private readonly markPurchaseAsReceivedUseCase: any;

  constructor(
    @Inject('PurchaseRepository') purchaseRepository: PurchaseRepository,
    @Inject('StoreRepository') storeRepository: StoreRepository,
    @Inject('SupplierRepository') supplierRepository: SupplierRepository,
    @Inject('UserRepository') userRepository: UserRepository,
    @Inject('ProductRepository') productRepository: ProductRepository,
  ) {
    // Importar use cases dinámicamente para evitar dependencias circulares
    const { 
      CreatePurchaseUseCase,
      UpdatePurchaseUseCase,
      GetPurchaseByIdUseCase,
      ListPurchasesUseCase,
      CancelPurchaseUseCase,
      MarkPurchaseAsReceivedUseCase
    } = require('../use-cases/purchase');

    // Importar PrismaService dinámicamente
    const { PrismaService } = require('../../infrastructure/database/prisma.service');

    this.createPurchaseUseCase = new CreatePurchaseUseCase(
      purchaseRepository,
      storeRepository,
      supplierRepository,
      userRepository,
      productRepository,
      new PrismaService()
    );
    this.updatePurchaseUseCase = new UpdatePurchaseUseCase(purchaseRepository);
    this.getPurchaseByIdUseCase = new GetPurchaseByIdUseCase(purchaseRepository);
    this.listPurchasesUseCase = new ListPurchasesUseCase(purchaseRepository);
    this.cancelPurchaseUseCase = new CancelPurchaseUseCase(purchaseRepository);
    this.markPurchaseAsReceivedUseCase = new MarkPurchaseAsReceivedUseCase(purchaseRepository);
  }

  async create(dto: CreatePurchaseDto): Promise<PurchaseResponseDto> {
    return this.createPurchaseUseCase.execute(dto);
  }

  async update(id: string, dto: UpdatePurchaseDto): Promise<PurchaseResponseDto> {
    return this.updatePurchaseUseCase.execute(id, dto);
  }

  async findById(id: string, storeFilter?: StoreFilter): Promise<PurchaseResponseDto> {
    return this.getPurchaseByIdUseCase.execute(id, storeFilter);
  }

  async listPurchases(query: PurchaseQueryDto, storeFilter?: StoreFilter): Promise<ListPurchasesResult> {
    return this.listPurchasesUseCase.execute(query, storeFilter);
  }

  async cancel(id: string): Promise<PurchaseResponseDto> {
    return this.cancelPurchaseUseCase.execute(id);
  }

  async markAsReceived(id: string): Promise<PurchaseResponseDto> {
    return this.markPurchaseAsReceivedUseCase.execute(id);
  }
}
