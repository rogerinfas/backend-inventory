import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { CreateCustomerDto, CustomerResponseDto } from '../../dto/customer';
import { CustomerMapper } from '../../mappers/customer.mapper';
import { CustomerAlreadyExistsError } from '../../errors/domain-errors';

export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    // 1. Verificar que no exista ya un cliente para esta tienda y persona
    const existingCustomer = await this.customerRepository.findByStoreAndPerson(
      dto.storeId,
      dto.personId,
    );
    
    if (existingCustomer) {
      throw new CustomerAlreadyExistsError(dto.storeId, dto.personId);
    }

    // 2. Crear entidad
    const id = crypto.randomUUID();
    const customer = CustomerMapper.toDomain(dto, id);

    // 3. Guardar
    const savedCustomer = await this.customerRepository.save(customer);

    // 4. Retornar DTO
    return CustomerMapper.toResponseDto(savedCustomer);
  }
}
