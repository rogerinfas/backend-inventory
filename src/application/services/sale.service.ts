import { Injectable, Inject } from '@nestjs/common';
import type { SaleRepository } from '../../domain/repositories';
import { CreateSaleDto, UpdateSaleDto, UpdateSaleStatusDto, SaleResponseDto, SaleQueryDto, ListSalesResponseDto } from '../dto/sale';

@Injectable()
export class SaleService {
  private readonly createSaleUseCase: any;
  private readonly updateSaleUseCase: any;
  private readonly updateSaleStatusUseCase: any;
  private readonly getSaleByIdUseCase: any;
  private readonly listSalesUseCase: any;
  private readonly deleteSaleUseCase: any;

  constructor(@Inject('SaleRepository') saleRepository: SaleRepository) {
    // Importar use cases dinámicamente para evitar dependencias circulares
    const { 
      CreateSaleUseCase, 
      UpdateSaleUseCase,
      UpdateSaleStatusUseCase,
      GetSaleByIdUseCase,
      ListSalesUseCase,
      DeleteSaleUseCase
    } = require('../use-cases/sale');
    
    // Importar otros repositorios dinámicamente
    const { StorePrismaRepository } = require('../../infrastructure/repositories/store.repository');
    const { CustomerPrismaRepository } = require('../../infrastructure/repositories/customer.repository');
    const { UserPrismaRepository } = require('../../infrastructure/repositories/user.repository');
    const { ProductPrismaRepository } = require('../../infrastructure/repositories/product.repository');
    const { PrismaService } = require('../../infrastructure/database/prisma.service');

    // Crear instancias de repositorios
    const prismaService = new PrismaService();
    const storeRepository = new StorePrismaRepository(prismaService);
    const customerRepository = new CustomerPrismaRepository(prismaService);
    const userRepository = new UserPrismaRepository(prismaService);
    const productRepository = new ProductPrismaRepository(prismaService);

    this.createSaleUseCase = new CreateSaleUseCase(
      saleRepository,
      storeRepository,
      customerRepository,
      userRepository,
      productRepository,
      prismaService
    );

    this.updateSaleUseCase = new UpdateSaleUseCase(saleRepository);

    this.updateSaleStatusUseCase = new UpdateSaleStatusUseCase(
      saleRepository,
      productRepository,
      prismaService
    );

    this.getSaleByIdUseCase = new GetSaleByIdUseCase(saleRepository);
    this.listSalesUseCase = new ListSalesUseCase(saleRepository);
    this.deleteSaleUseCase = new DeleteSaleUseCase(saleRepository);
  }

  async create(createSaleDto: CreateSaleDto): Promise<SaleResponseDto> {
    return this.createSaleUseCase.execute(createSaleDto);
  }

  async update(saleId: string, updateSaleDto: UpdateSaleDto): Promise<SaleResponseDto> {
    return this.updateSaleUseCase.execute(saleId, updateSaleDto);
  }

  async updateStatus(saleId: string, updateSaleStatusDto: UpdateSaleStatusDto): Promise<SaleResponseDto> {
    return this.updateSaleStatusUseCase.execute(saleId, updateSaleStatusDto);
  }

  async findById(saleId: string): Promise<SaleResponseDto> {
    return this.getSaleByIdUseCase.execute(saleId);
  }

  async findAll(query: SaleQueryDto): Promise<ListSalesResponseDto> {
    return this.listSalesUseCase.execute(query);
  }

  async delete(saleId: string): Promise<void> {
    return this.deleteSaleUseCase.execute(saleId);
  }
}