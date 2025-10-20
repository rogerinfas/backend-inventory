import { Injectable, Inject } from '@nestjs/common';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  ProductResponseDto, 
  ProductQueryDto,
  AddStockDto,
  RemoveStockDto,
  UpdateStockDto
} from '../dto/product';
import { ListProductsResult } from '../use-cases/product';

@Injectable()
export class ProductService {
  private readonly createProductUseCase: any;
  private readonly updateProductUseCase: any;
  private readonly getProductByIdUseCase: any;
  private readonly listProductsUseCase: any;
  private readonly deleteProductUseCase: any;
  private readonly addStockUseCase: any;
  private readonly removeStockUseCase: any;
  private readonly updateStockUseCase: any;

  constructor(@Inject('ProductRepository') productRepository: ProductRepository) {
    // Importar use cases dinámicamente para evitar dependencias circulares
    const { 
      CreateProductUseCase,
      UpdateProductUseCase,
      GetProductByIdUseCase,
      ListProductsUseCase,
      DeleteProductUseCase,
      AddStockUseCase,
      RemoveStockUseCase,
      UpdateStockUseCase
    } = require('../use-cases/product');

    this.createProductUseCase = new CreateProductUseCase(productRepository);
    this.updateProductUseCase = new UpdateProductUseCase(productRepository);
    this.getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
    this.listProductsUseCase = new ListProductsUseCase(productRepository);
    this.deleteProductUseCase = new DeleteProductUseCase(productRepository);
    this.addStockUseCase = new AddStockUseCase(productRepository);
    this.removeStockUseCase = new RemoveStockUseCase(productRepository);
    this.updateStockUseCase = new UpdateStockUseCase(productRepository);
  }

  async createProduct(dto: CreateProductDto): Promise<ProductResponseDto> {
    return this.createProductUseCase.execute(dto);
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    return this.updateProductUseCase.execute(id, dto);
  }

  async getProductById(id: string): Promise<ProductResponseDto | null> {
    return this.getProductByIdUseCase.execute(id);
  }

  async listProducts(query: ProductQueryDto): Promise<ListProductsResult> {
    return this.listProductsUseCase.execute(query);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.deleteProductUseCase.execute(id);
  }

  async addStock(id: string, dto: AddStockDto): Promise<ProductResponseDto> {
    return this.addStockUseCase.execute(id, dto);
  }

  async removeStock(id: string, dto: RemoveStockDto): Promise<ProductResponseDto> {
    return this.removeStockUseCase.execute(id, dto);
  }

  async updateStock(id: string, dto: UpdateStockDto): Promise<ProductResponseDto> {
    return this.updateStockUseCase.execute(id, dto);
  }

  // TODO: Implementar método para consultar historial de movimientos de inventario
  // async getInventoryMovements(
  //   productId: string,
  //   page: number = 1,
  //   limit: number = 10,
  //   type?: string,
  // ): Promise<any> {
  //   // Implementar lógica para obtener movimientos de inventario
  //   // - Filtrar por productId
  //   - Aplicar filtros de tipo y paginación
  //   - Retornar datos paginados con metadatos
  // }
}
