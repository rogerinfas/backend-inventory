import { Injectable } from '@nestjs/common';
import type { SaleRepository, ProductRepository } from '../../../domain/repositories';
import { SaleResponseDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';
import { SaleNotFoundError } from '../../errors/domain-errors';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { SaleStatus } from '../../../domain/enums';

@Injectable()
export class RefundSaleUseCase {
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

      // 2. Verificar que se puede procesar devolución
      if (sale.status !== SaleStatus.COMPLETED) {
        throw new Error(
          `No se puede procesar devolución de una venta en estado ${sale.status}. ` +
          'Solo se pueden procesar devoluciones de ventas completadas.'
        );
      }

      // 3. Restaurar el stock de todos los productos
      for (const detail of details) {
        await this.productRepository.increaseStock(
          detail.productId,
          detail.quantity,
          sale.storeId,
          tx
        );
      }

      // 4. Cambiar estado a REFUNDED
      sale.refund();

      // 5. Guardar y retornar
      const savedSale = await this.saleRepository.updateWithTransaction(sale, tx);
      return SaleMapper.toResponseDto(savedSale, details);
    });
  }
}

