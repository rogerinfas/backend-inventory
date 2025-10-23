import { Injectable } from '@nestjs/common';
import type { 
  SaleRepository, 
  StoreRepository, 
  CustomerRepository, 
  UserRepository, 
  ProductRepository,
  VoucherSeriesRepository 
} from '../../../domain/repositories';
import { CreateSaleDto, SaleResponseDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';
import { 
  StoreNotFoundError, 
  CustomerNotFoundError, 
  UserNotFoundError, 
  ProductNotFoundError, 
  SaleAlreadyExistsError,
  InsufficientStockError 
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
    private readonly voucherSeriesRepository: VoucherSeriesRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(dto: CreateSaleDto): Promise<SaleResponseDto> {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        // 1. Verificar que la tienda existe
        const store = await this.storeRepository.findById(dto.storeId);
        if (!store) {
          throw new StoreNotFoundError(dto.storeId);
        }

        // 2. Verificar que el cliente existe
        const customer = await this.customerRepository.findById(dto.customerId);
        if (!customer) {
          throw new CustomerNotFoundError(dto.customerId);
        }

        // 3. Verificar que el usuario vendedor existe
        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
          throw new UserNotFoundError(dto.userId);
        }

        // 4. Verificar que todos los productos existen, pertenecen a la tienda y tienen stock suficiente
        for (const detail of dto.details) {
          const product = await this.productRepository.findById(detail.productId);
          if (!product) {
            throw new ProductNotFoundError(detail.productId);
          }
          if (product.storeId !== dto.storeId) {
            throw new Error(`Producto ${detail.productId} no pertenece a la tienda ${dto.storeId}`);
          }
          if (!product.hasStockAvailable(detail.quantity)) {
            throw new InsufficientStockError(detail.quantity, product.currentStock);
          }
        }

        // 5. Verificar que no existe una venta con el mismo número de documento (si se proporciona)
        if (dto.documentNumber) {
          const existingSale = await this.saleRepository.findByStoreAndDocument(
            dto.storeId,
            dto.documentNumber
          );
          if (existingSale) {
            throw new SaleAlreadyExistsError(dto.storeId, dto.documentNumber);
          }
        }

        // 6. Obtener el siguiente número de documento automáticamente
        const documentNumber = await this.saleRepository.getNextDocumentNumber(
          dto.storeId,
          dto.documentType,
          dto.series
        );

        // 7. Crear la venta y sus detalles usando el mapper
        const { sale, details } = SaleMapper.toDomain({
          ...dto,
          documentNumber: dto.documentNumber || documentNumber,
        });

        // 8. Persistir la venta con sus detalles de forma atómica
        const result = await this.saleRepository.createWithDetailsTransaction(
          sale,
          details,
          tx
        );

        // 9. Decrementar stock de productos dentro de la misma transacción
        for (const detail of details) {
          await this.productRepository.decreaseStock(
            detail.productId, 
            detail.quantity, 
            dto.storeId, 
            tx
          );
        }

        // 10. Incrementar número de serie de comprobante
        await this.saleRepository.incrementDocumentNumber(
          dto.storeId,
          dto.documentType,
          dto.series,
          tx
        );

        // 11. Retornar la respuesta con todos los datos
        return SaleMapper.toResponseDto(result.sale, result.details);
      });
    } catch (error) {
      // Re-lanzar errores de dominio tal como están
      throw error;
    }
  }
}
