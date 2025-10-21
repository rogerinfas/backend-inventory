import { Injectable } from '@nestjs/common';
import type { SaleRepository } from '../../../domain/repositories';
import { SaleNotFoundError } from '../../errors/domain-errors';

@Injectable()
export class DeleteSaleUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(saleId: string): Promise<void> {
    try {
      // 1. Verificar que la venta existe
      const sale = await this.saleRepository.findById(saleId);
      if (!sale) {
        throw new SaleNotFoundError(saleId);
      }

      // 2. Validar que la venta se puede eliminar
      if (sale.status !== 'PENDING') {
        throw new Error('Solo se pueden eliminar ventas en estado PENDING');
      }

      // 3. Eliminar la venta (los detalles se eliminan por CASCADE)
      await this.saleRepository.delete(saleId);
    } catch (error) {
      if (error instanceof SaleNotFoundError) {
        throw error;
      }
      throw new Error(`Error al eliminar la venta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
