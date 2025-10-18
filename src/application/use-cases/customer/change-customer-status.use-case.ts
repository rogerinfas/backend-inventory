import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { ChangeCustomerStatusDto, CustomerResponseDto } from '../../dto/customer';
import { CustomerMapper } from '../../mappers/customer.mapper';
import { CustomerNotFoundError, CustomerDeletedError, InvalidStatusChangeError } from '../../errors/domain-errors';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class ChangeCustomerStatusUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string, dto: ChangeCustomerStatusDto): Promise<CustomerResponseDto> {
    // 1. Buscar cliente existente
    const existingCustomer = await this.customerRepository.findById(id);
    if (!existingCustomer) {
      throw new CustomerNotFoundError(id);
    }

    // 2. Verificar que no esté eliminado
    if (existingCustomer.isDeleted()) {
      throw new CustomerDeletedError(id);
    }

    // 3. Validar cambio de estado
    this.validateStatusChange(existingCustomer.status, dto.status);

    // 4. Aplicar cambio de estado
    switch (dto.status) {
      case EntityStatus.ACTIVE:
        existingCustomer.activate();
        break;
      case EntityStatus.INACTIVE:
        existingCustomer.deactivate();
        break;
      case EntityStatus.SUSPENDED:
        existingCustomer.suspend();
        break;
      case EntityStatus.DELETED:
        existingCustomer.delete();
        break;
    }

    // 5. Guardar y retornar
    const savedCustomer = await this.customerRepository.update(existingCustomer);
    return CustomerMapper.toResponseDto(savedCustomer);
  }

  private validateStatusChange(currentStatus: EntityStatus, newStatus: EntityStatus): void {
    // Reglas de negocio para cambios de estado
    if (currentStatus === EntityStatus.DELETED) {
      throw new InvalidStatusChangeError(currentStatus, newStatus);
    }

    if (currentStatus === newStatus) {
      throw new InvalidStatusChangeError(currentStatus, newStatus);
    }
  }
}
