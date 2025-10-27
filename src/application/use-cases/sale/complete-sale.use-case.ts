import { Injectable } from '@nestjs/common';
import type { SaleRepository, ProductRepository } from '../../../domain/repositories';
import { SaleResponseDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';
import { 
  SaleNotFoundError, 
  SaleAlreadyCompletedError,
  InsufficientStockError,
  ProductNotFoundError 
} from '../../errors/domain-errors';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { SaleStatus } from '../../../domain/enums';
import { Sale } from '../../../domain/entities';

@Injectable()
export class CompleteSaleUseCase {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly productRepository: ProductRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(id: string): Promise<SaleResponseDto> {
    return await this.prismaService.$transaction(async (tx) => {
      // 1. Buscar venta con sus detalles
      const saleWithDetails = await this.saleRepository.findByIdWithDetails(id);
      if (!saleWithDetails) {
        throw new SaleNotFoundError(id);
      }

      const { sale, details } = saleWithDetails;

      // 2. Verificar que se puede completar
      if (sale.status === SaleStatus.COMPLETED) {
        throw new SaleAlreadyCompletedError(id);
      }

      // 3. Validar que todos los productos tienen stock suficiente
      for (const detail of details) {
        const product = await this.productRepository.findById(detail.productId);
        if (!product) {
          throw new ProductNotFoundError(detail.productId);
        }
        if (!product.hasStockAvailable(detail.quantity)) {
          throw new InsufficientStockError(detail.quantity, product.currentStock);
        }
      }

      // 4. Decrementar stock de productos
      for (const detail of details) {
        await this.productRepository.decreaseStock(
          detail.productId,
          detail.quantity,
          sale.storeId,
          tx
        );
      }

      // 5. Generar número de documento si no existe
      if (!sale.documentNumber) {
        const documentNumber = await this.saleRepository.getNextDocumentNumber(
          sale.storeId,
          sale.documentType,
          sale.series
        );
        
        // Actualizar el número de documento en la venta
        const updatedSale = Sale.fromPersistence({
          ...sale,
          documentNumber,
          status: SaleStatus.COMPLETED,
          updatedAt: new Date(),
        });

        // Incrementar el correlativo
        await this.saleRepository.incrementDocumentNumber(
          sale.storeId,
          sale.documentType,
          sale.series,
          tx
        );

        // Guardar la venta con el nuevo número y estado COMPLETED
        const savedSale = await this.saleRepository.updateWithTransaction(updatedSale, tx);
        return SaleMapper.toResponseDto(savedSale, details);
      }

      // 6. Si ya tiene número de documento, solo cambiar estado a COMPLETED
      sale.complete();
      const savedSale = await this.saleRepository.updateWithTransaction(sale, tx);
      return SaleMapper.toResponseDto(savedSale, details);
    });
  }
}
