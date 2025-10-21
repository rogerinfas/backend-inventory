import { Injectable } from '@nestjs/common';
import type { SaleRepository } from '../../../domain/repositories';
import { UpdateSaleDto } from '../../dto/sale';
import { SaleResponseDto } from '../../dto/sale';
import { SaleMapper } from '../../mappers/sale.mapper';
import { SaleNotFoundError } from '../../errors/domain-errors';
import { Sale } from '../../../domain/entities/sale.entity';

@Injectable()
export class UpdateSaleUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(saleId: string, dto: UpdateSaleDto): Promise<SaleResponseDto> {
    try {
      // 1. Buscar la venta
      const sale = await this.saleRepository.findById(saleId);
      if (!sale) {
        throw new SaleNotFoundError(saleId);
      }

      // 2. Actualizar solo los campos proporcionados
      if (dto.documentNumber !== undefined) {
        // Validar que el número de documento no esté en uso por otra venta
        if (dto.documentNumber && await this.saleRepository.existsByDocumentNumber(dto.documentNumber)) {
          throw new Error(`Ya existe una venta con el número de documento ${dto.documentNumber}`);
        }
      }

      // 3. Crear una nueva instancia con los datos actualizados
      const updatedSale = Sale.fromPersistence({
        id: sale.id,
        storeId: sale.storeId,
        customerId: sale.customerId,
        userId: sale.userId,
        documentNumber: dto.documentNumber !== undefined ? dto.documentNumber : sale.documentNumber,
        documentType: dto.documentType !== undefined ? dto.documentType : sale.documentType,
        saleDate: dto.saleDate !== undefined ? new Date(dto.saleDate) : sale.saleDate,
        subtotal: sale.subtotal,
        tax: dto.tax !== undefined ? dto.tax : sale.tax,
        discount: dto.discount !== undefined ? dto.discount : sale.discount,
        total: sale.total,
        status: sale.status,
        notes: dto.notes !== undefined ? dto.notes : sale.notes,
        registeredAt: sale.registeredAt,
        updatedAt: new Date(),
      });

      // 4. Persistir los cambios
      const savedSale = await this.saleRepository.update(updatedSale);

      // 5. Obtener los detalles para la respuesta
      const details = await this.getSaleDetails(saleId);

      return SaleMapper.toResponseDto(savedSale, details);
    } catch (error) {
      if (error instanceof SaleNotFoundError) {
        throw error;
      }
      throw new Error(`Error al actualizar la venta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private async getSaleDetails(saleId: string): Promise<any[]> {
    // TODO: Implementar método en SaleRepository para obtener detalles
    return [];
  }
}
