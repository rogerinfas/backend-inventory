import { Injectable, Inject } from '@nestjs/common';
import type { SaleRepository } from '../../domain/repositories';
import type { StoreFilter } from '../../domain/value-objects';
import { 
  CreateSaleDto, 
  UpdateSaleDto, 
  SaleQueryDto, 
  SaleResponseDto,
  RefundSaleDto
} from '../dto/sale';
import { ListSalesResult } from '../use-cases/sale';

@Injectable()
export class SaleService {
  private readonly createSaleUseCase: any;
  private readonly updateSaleUseCase: any;
  private readonly getSaleByIdUseCase: any;
  private readonly listSalesUseCase: any;
  private readonly cancelSaleUseCase: any;
  private readonly completeSaleUseCase: any;
  private readonly refundSaleUseCase: any;

  constructor(
    @Inject('SaleRepository') saleRepository: SaleRepository,
    @Inject('StoreRepository') storeRepository: any,
    @Inject('CustomerRepository') customerRepository: any,
    @Inject('UserRepository') userRepository: any,
    @Inject('ProductRepository') productRepository: any,
    @Inject('VoucherSeriesRepository') voucherSeriesRepository: any,
  ) {
    // Importar use cases dinámicamente para evitar dependencias circulares
    const { 
      CreateSaleUseCase,
      UpdateSaleUseCase,
      GetSaleByIdUseCase,
      ListSalesUseCase,
      CancelSaleUseCase,
      CompleteSaleUseCase,
      RefundSaleUseCase
    } = require('../use-cases/sale');

    // Importar PrismaService dinámicamente
    const { PrismaService } = require('../../infrastructure/database/prisma.service');
    const prismaService = new PrismaService();

    this.createSaleUseCase = new CreateSaleUseCase(
      saleRepository,
      storeRepository,
      customerRepository,
      userRepository,
      productRepository,
      voucherSeriesRepository,
      prismaService
    );
    this.updateSaleUseCase = new UpdateSaleUseCase(saleRepository);
    this.getSaleByIdUseCase = new GetSaleByIdUseCase(saleRepository);
    this.listSalesUseCase = new ListSalesUseCase(saleRepository);
    this.cancelSaleUseCase = new CancelSaleUseCase(
      saleRepository,
      productRepository,
      prismaService
    );
    this.completeSaleUseCase = new CompleteSaleUseCase(
      saleRepository,
      productRepository,
      prismaService
    );
    this.refundSaleUseCase = new RefundSaleUseCase(
      saleRepository,
      productRepository,
      prismaService
    );
  }

  async createSale(dto: CreateSaleDto): Promise<SaleResponseDto> {
    return this.createSaleUseCase.execute(dto);
  }

  async updateSale(id: string, dto: UpdateSaleDto): Promise<SaleResponseDto> {
    return this.updateSaleUseCase.execute(id, dto);
  }

  async getSaleById(id: string, storeFilter?: StoreFilter): Promise<SaleResponseDto> {
    return this.getSaleByIdUseCase.execute(id, storeFilter);
  }

  async listSales(query: SaleQueryDto, storeFilter?: StoreFilter): Promise<ListSalesResult> {
    return this.listSalesUseCase.execute(query, storeFilter);
  }

  async cancelSale(id: string): Promise<SaleResponseDto> {
    return this.cancelSaleUseCase.execute(id);
  }

  async completeSale(id: string): Promise<SaleResponseDto> {
    return this.completeSaleUseCase.execute(id);
  }

  async refundSale(id: string): Promise<SaleResponseDto> {
    return this.refundSaleUseCase.execute(id);
  }
}
