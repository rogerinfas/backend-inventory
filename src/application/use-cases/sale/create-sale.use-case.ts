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

        // 4. Verificar que todos los productos existen y pertenecen a la tienda
        // NO validamos stock aquí, solo al completar la venta
        for (const detail of dto.details) {
          const product = await this.productRepository.findById(detail.productId);
          if (!product) {
            throw new ProductNotFoundError(detail.productId);
          }
          if (product.storeId !== dto.storeId) {
            throw new Error(`Producto ${detail.productId} no pertenece a la tienda ${dto.storeId}`);
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

        // 6. Crear la venta y sus detalles usando el mapper
        // El número de documento se generará al completar la venta
        const { sale, details } = SaleMapper.toDomain({
          ...dto,
          documentNumber: dto.documentNumber, // Puede ser undefined
        });

        // 7. Persistir la venta con sus detalles de forma atómica
        const result = await this.saleRepository.createWithDetailsTransaction(
          sale,
          details,
          tx
        );

        // ❌ NO decrementar stock aquí - se hará al completar la venta
        // ❌ NO incrementar número de serie aquí - se hará al completar la venta

        // 8. Retornar la respuesta con todos los datos
        return SaleMapper.toResponseDto(result.sale, result.details);
      });
    } catch (error) {
      // Re-lanzar errores de dominio tal como están
      throw error;
    }
  }
}
