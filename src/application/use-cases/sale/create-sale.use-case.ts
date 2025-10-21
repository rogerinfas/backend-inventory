import { Injectable } from '@nestjs/common';
import type { 
  SaleRepository, 
  StoreRepository, 
  CustomerRepository, 
  UserRepository, 
  ProductRepository 
} from '../../../domain/repositories';
import { CreateSaleDto } from '../../dto/sale';
import { SaleResponseDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';
import { 
  StoreNotFoundError, 
  CustomerNotFoundError, 
  UserNotFoundError, 
  ProductNotFoundError,
  SaleCreationError,
  FutureDateError,
} from '../../errors/domain-errors';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class CreateSaleUseCase {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly storeRepository: StoreRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(dto: CreateSaleDto): Promise<SaleResponseDto> {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        // 1. Validar que la tienda existe
        const store = await this.storeRepository.findById(dto.storeId);
        if (!store) {
          throw new StoreNotFoundError(dto.storeId);
        }

        // 2. Validar que el cliente existe
        const customer = await this.customerRepository.findById(dto.customerId);
        if (!customer) {
          throw new CustomerNotFoundError(dto.customerId);
        }

        // 3. Validar que el usuario existe
        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
          throw new UserNotFoundError(dto.userId);
        }

        // 4. Validar que todos los productos existen y pertenecen a la tienda
        for (const detail of dto.details) {
          const product = await this.productRepository.findById(detail.productId);
          if (!product) {
            throw new ProductNotFoundError(detail.productId);
          }
          if (product.storeId !== dto.storeId) {
            throw new Error(`El producto ${detail.productId} no pertenece a la tienda ${dto.storeId}`);
          }
        }

        // 5. Validar stock disponible (currentStock - reservedStock)
        for (const detail of dto.details) {
          const product = await this.productRepository.findById(detail.productId);
          const availableStock = product!.currentStock - product!.reservedStock;
          if (availableStock < detail.quantity) {
            throw new Error(`Stock insuficiente para el producto ${detail.productId}. Disponible: ${availableStock}, Solicitado: ${detail.quantity}`);
          }
        }

        // 6. Crear la venta y sus detalles usando el mapper (el subtotal se calcula automáticamente)
        const { sale, details } = SaleMapper.toDomain(dto);

        // 7. Persistir la venta con sus detalles de forma atómica
        const result = await this.saleRepository.createWithDetailsTransaction(
          sale,
          details,
          tx
        );

        // 8. Incrementar el reservedStock de los productos
        for (const detail of details) {
          await this.productRepository.setReservedStock(detail.productId, detail.quantity, dto.storeId, tx);
        }

        // 9. Retornar la respuesta con todos los datos
        return SaleMapper.toResponseDto(result.sale, result.details);
      });
    } catch (error) {
      if (error instanceof StoreNotFoundError || 
          error instanceof CustomerNotFoundError || 
          error instanceof UserNotFoundError || 
          error instanceof ProductNotFoundError ||
          error instanceof FutureDateError
          ) {
        throw error;
      }
      throw new SaleCreationError(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
}
