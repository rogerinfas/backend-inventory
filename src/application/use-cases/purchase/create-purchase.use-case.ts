import { Injectable, Inject } from '@nestjs/common';
import type { PurchaseRepository, StoreRepository, SupplierRepository, UserRepository, ProductRepository } from '../../../domain/repositories';
import { CreatePurchaseDto, PurchaseResponseDto } from '../../dto/purchase';
import { PurchaseMapper } from '../../mappers';
import { 
  StoreNotFoundError, 
  SupplierNotFoundError, 
  UserNotFoundError, 
  ProductNotFoundError,
  PurchaseAlreadyExistsError,
  PurchaseCreationError,
  FutureDateError
} from '../../errors/domain-errors';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class CreatePurchaseUseCase {
  constructor(
    @Inject('PurchaseRepository') private readonly purchaseRepository: PurchaseRepository,
    @Inject('StoreRepository') private readonly storeRepository: StoreRepository,
    @Inject('SupplierRepository') private readonly supplierRepository: SupplierRepository,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('ProductRepository') private readonly productRepository: ProductRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(dto: CreatePurchaseDto): Promise<PurchaseResponseDto> {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        // 1. Verificar que la tienda existe
        const store = await this.storeRepository.findById(dto.storeId);
        if (!store) {
          throw new StoreNotFoundError(dto.storeId);
        }

        // 2. Verificar que el proveedor existe
        const supplier = await this.supplierRepository.findById(dto.supplierId);
        if (!supplier) {
          throw new SupplierNotFoundError(dto.supplierId);
        }

        // 3. Verificar que el usuario existe
        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
          throw new UserNotFoundError(dto.userId);
        }

        // 4. Verificar que todos los productos existen y pertenecen a la misma tienda
        for (const detail of dto.details) {
          const product = await this.productRepository.findById(detail.productId);
          if (!product) {
            throw new ProductNotFoundError(detail.productId);
          }
          if (product.storeId !== dto.storeId) {
            throw new Error(`Producto ${detail.productId} no pertenece a la tienda ${dto.storeId}`);
          }
        }

        // 5. Verificar que no existe una compra con el mismo número de documento (si se proporciona)
        if (dto.documentNumber) {
          const existingPurchase = await this.purchaseRepository.findByStoreAndDocument(
            dto.storeId,
            dto.documentNumber
          );
          if (existingPurchase) {
            throw new PurchaseAlreadyExistsError(dto.storeId, dto.documentNumber);
          }
        }

        // 6. Crear la compra y sus detalles usando el mapper (el subtotal se calcula automáticamente)
        const { purchase, details } = PurchaseMapper.toDomain(dto);

        // 7. Persistir la compra con sus detalles de forma atómica
        const result = await this.purchaseRepository.createWithDetailsTransaction(
          purchase,
          details,
          tx
        );

        // 8. Incrementar stock de productos dentro de la misma transacción
        for (const detail of details) {
          await this.productRepository.increaseStock(detail.productId, detail.quantity, dto.storeId, tx);
        }

        // 9. Retornar la respuesta con todos los datos
        return PurchaseMapper.toResponseDto(result.purchase, result.details);
      });
    } catch (error) {
      // Re-lanzar errores de dominio tal como están
      if (error instanceof StoreNotFoundError || 
          error instanceof SupplierNotFoundError || 
          error instanceof UserNotFoundError || 
          error instanceof ProductNotFoundError || 
          error instanceof PurchaseAlreadyExistsError ||
          error instanceof FutureDateError) {
        throw error;
      }
      
      // Para otros errores, envolver en un error más específico
      throw new PurchaseCreationError(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
}
