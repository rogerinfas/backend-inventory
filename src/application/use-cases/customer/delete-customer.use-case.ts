import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { CustomerNotFoundError, CustomerDeletedError } from '../../errors/domain-errors';

export class DeleteCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string): Promise<void> {
    // 1. Buscar cliente existente
    const existingCustomer = await this.customerRepository.findById(id);
    if (!existingCustomer) {
      throw new CustomerNotFoundError(id);
    }

    // 2. Verificar que no esté ya eliminado
    if (existingCustomer.isDeleted()) {
      throw new CustomerDeletedError(id);
    }

    // 3. Realizar soft delete
    existingCustomer.delete();

    // 4. Guardar cambios
    await this.customerRepository.update(existingCustomer);
  }
}
