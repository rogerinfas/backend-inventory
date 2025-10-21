import { Injectable } from '@nestjs/common';
import type { SaleRepository, ProductRepository } from '../../../domain/repositories';
import { UpdateSaleStatusDto } from '../../dto/sale';
import { SaleResponseDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';
import { SaleNotFoundError } from '../../errors/domain-errors';
import { SaleStatus } from '../../../domain/enums/sale-status.enum';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class UpdateSaleStatusUseCase {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly productRepository: ProductRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(saleId: string, dto: UpdateSaleStatusDto): Promise<SaleResponseDto> {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        // 1. Buscar la venta
        const sale = await this.saleRepository.findById(saleId);
        if (!sale) {
          throw new SaleNotFoundError(saleId);
        }

        // 2. Validar transición de estado
        this.validateStatusTransition(sale.status, dto.status);

        // 3. Actualizar el estado en la entidad
        if (dto.status === SaleStatus.COMPLETED) {
          sale.complete();
        } else if (dto.status === SaleStatus.CANCELLED) {
          sale.cancel();
        } else if (dto.status === SaleStatus.REFUNDED) {
          sale.refund();
        }

        // 4. Persistir el cambio
        const updatedSale = await this.saleRepository.update(sale);

        // 5. Manejar cambios de stock según el estado
        if (dto.status === SaleStatus.COMPLETED) {
          // Completar venta: reducir currentStock y reservedStock
          await this.handleCompletedSale(sale, tx);
        } else if (dto.status === SaleStatus.CANCELLED) {
          // Cancelar venta: solo reducir reservedStock
          await this.handleCancelledSale(sale, tx);
        } else if (dto.status === SaleStatus.REFUNDED) {
          // Reembolsar venta: restaurar currentStock
          await this.handleRefundedSale(sale, tx);
        }

        // 6. Obtener los detalles para la respuesta
        const details = await this.getSaleDetails(saleId);

        return SaleMapper.toResponseDto(updatedSale, details);
      });
    } catch (error) {
      if (error instanceof SaleNotFoundError) {
        throw error;
      }
      throw new Error(`Error al actualizar estado de venta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private validateStatusTransition(currentStatus: SaleStatus, newStatus: SaleStatus): void {
    const validTransitions: Record<SaleStatus, SaleStatus[]> = {
      [SaleStatus.PENDING]: [SaleStatus.COMPLETED, SaleStatus.CANCELLED],
      [SaleStatus.COMPLETED]: [SaleStatus.REFUNDED],
      [SaleStatus.CANCELLED]: [],
      [SaleStatus.REFUNDED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new Error(`No se puede cambiar el estado de ${currentStatus} a ${newStatus}`);
    }
  }

  private async handleCompletedSale(sale: any, tx: any): Promise<void> {
    // Obtener detalles de la venta
    const details = await this.getSaleDetails(sale.id);
    
    for (const detail of details) {
      // Reducir currentStock y reservedStock
      await this.productRepository.increaseStock(detail.productId, -detail.quantity, sale.storeId, tx);
      await this.productRepository.setReservedStock(detail.productId, -detail.quantity, sale.storeId, tx);
    }
  }

  private async handleCancelledSale(sale: any, tx: any): Promise<void> {
    // Obtener detalles de la venta
    const details = await this.getSaleDetails(sale.id);
    
    for (const detail of details) {
      // Solo reducir reservedStock (no tocar currentStock)
      await this.productRepository.setReservedStock(detail.productId, -detail.quantity, sale.storeId, tx);
    }
  }

  private async handleRefundedSale(sale: any, tx: any): Promise<void> {
    // Obtener detalles de la venta
    const details = await this.getSaleDetails(sale.id);
    
    for (const detail of details) {
      // Restaurar currentStock
      await this.productRepository.increaseStock(detail.productId, detail.quantity, sale.storeId, tx);
    }
  }

  private async getSaleDetails(saleId: string): Promise<any[]> {
    // TODO: Implementar método en SaleRepository para obtener detalles
    // Por ahora retornamos array vacío, se implementará cuando se agregue el método
    return [];
  }
}
