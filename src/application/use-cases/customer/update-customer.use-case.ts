import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { UpdateCustomerDto, CustomerResponseDto } from '../../dto/customer';
import { CustomerMapper } from '../../mappers/customer.mapper';
import { CustomerNotFoundError, CustomerDeletedError, InvalidStatusChangeError } from '../../errors/domain-errors';
import { EntityStatus } from '../../../domain/enums/entity-status.enum';

export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string, dto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    // 1. Buscar cliente existente
    const existingCustomer = await this.customerRepository.findById(id);
    if (!existingCustomer) {
      throw new CustomerNotFoundError(id);
    }

    // 2. Verificar que no esté eliminado
    if (existingCustomer.isDeleted()) {
      throw new CustomerDeletedError(id);
    }

    // 3. Validar que hay campos para actualizar
    if (!this.validateUpdateDto(dto)) {
      throw new Error('No hay campos válidos para actualizar');
    }

    // 4. Aplicar actualizaciones
    if (dto.status !== undefined) {
      this.validateStatusChange(existingCustomer.status, dto.status);
      this.applyStatusChange(existingCustomer, dto.status);
    }

    // 5. Guardar y retornar
    const savedCustomer = await this.customerRepository.update(existingCustomer);
    return CustomerMapper.toResponseDto(savedCustomer);
  }

  private validateUpdateDto(dto: UpdateCustomerDto): boolean {
    return dto.status !== undefined;
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

  private applyStatusChange(customer: any, newStatus: EntityStatus): void {
    switch (newStatus) {
      case EntityStatus.ACTIVE:
        customer.activate();
        break;
      case EntityStatus.INACTIVE:
        customer.deactivate();
        break;
      case EntityStatus.SUSPENDED:
        customer.suspend();
        break;
      case EntityStatus.DELETED:
        customer.delete();
        break;
    }
  }
}
