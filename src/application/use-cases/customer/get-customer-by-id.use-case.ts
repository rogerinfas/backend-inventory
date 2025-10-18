import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { CustomerResponseDto } from '../../dto/customer';
import { CustomerMapper } from '../../mappers/customer.mapper';
import { CustomerNotFoundError } from '../../errors/domain-errors';

export class GetCustomerByIdUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string): Promise<CustomerResponseDto> {
    // 1. Buscar cliente
    const customer = await this.customerRepository.findById(id);
    
    if (!customer) {
      throw new CustomerNotFoundError(id);
    }

    // 2. Retornar DTO
    return CustomerMapper.toResponseDto(customer);
  }
}
