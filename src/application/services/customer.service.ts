import { Injectable, Inject } from '@nestjs/common';
import type { CustomerRepository } from '../../domain/repositories/customer.repository';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerResponseDto,
  CustomerQueryDto,
  ChangeCustomerStatusDto,
} from '../dto/customer';
import {
  CreateCustomerUseCase,
  UpdateCustomerUseCase,
  GetCustomerByIdUseCase,
  ListCustomersUseCase,
  ListCustomersResult,
  ChangeCustomerStatusUseCase,
  DeleteCustomerUseCase,
} from '../use-cases/customer';

@Injectable()
export class CustomerService {
  private readonly createCustomerUseCase: CreateCustomerUseCase;
  private readonly updateCustomerUseCase: UpdateCustomerUseCase;
  private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase;
  private readonly listCustomersUseCase: ListCustomersUseCase;
  private readonly changeCustomerStatusUseCase: ChangeCustomerStatusUseCase;
  private readonly deleteCustomerUseCase: DeleteCustomerUseCase;

  constructor(@Inject('CustomerRepository') customerRepository: CustomerRepository) {
    this.createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    this.updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
    this.getCustomerByIdUseCase = new GetCustomerByIdUseCase(customerRepository);
    this.listCustomersUseCase = new ListCustomersUseCase(customerRepository);
    this.changeCustomerStatusUseCase = new ChangeCustomerStatusUseCase(customerRepository);
    this.deleteCustomerUseCase = new DeleteCustomerUseCase(customerRepository);
  }

  async createCustomer(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    return this.createCustomerUseCase.execute(dto);
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    return this.updateCustomerUseCase.execute(id, dto);
  }

  async getCustomerById(id: string): Promise<CustomerResponseDto> {
    return this.getCustomerByIdUseCase.execute(id);
  }

  async listCustomers(query: CustomerQueryDto): Promise<ListCustomersResult> {
    return this.listCustomersUseCase.execute(query);
  }

  async changeCustomerStatus(id: string, dto: ChangeCustomerStatusDto): Promise<CustomerResponseDto> {
    return this.changeCustomerStatusUseCase.execute(id, dto);
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.deleteCustomerUseCase.execute(id);
  }
}
