import { ForbiddenException } from '@nestjs/common';
import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { CustomerResponseDto } from '../../dto/customer';
import { CustomerMapper } from '../../mappers/customer.mapper';
import { CustomerNotFoundError } from '../../errors/domain-errors';
import type { StoreFilter } from '../../../domain/value-objects';

export class GetCustomerByIdUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(
    id: string,
    storeFilter?: StoreFilter
  ): Promise<CustomerResponseDto> {
    // 1. Buscar cliente
    const customer = await this.customerRepository.findById(id);
    
    if (!customer) {
      throw new CustomerNotFoundError(id);
    }

    // Validar que el cliente pertenezca a la tienda del solicitante
    // Solo aplica para ADMIN/SELLER, SUPERADMIN puede ver cualquier cliente
    if (storeFilter && storeFilter.storeId && customer.storeId !== storeFilter.storeId) {
      throw new ForbiddenException(
        'No tiene permisos para acceder a este cliente'
      );
    }

    // 2. Retornar DTO
    return CustomerMapper.toResponseDto(customer);
  }
}
