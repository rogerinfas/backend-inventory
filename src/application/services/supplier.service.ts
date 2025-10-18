import { Injectable, Inject } from '@nestjs/common';
import type { SupplierRepository } from '../../domain/repositories/supplier.repository';
import {
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierResponseDto,
  SupplierQueryDto,
  ChangeSupplierStatusDto,
} from '../dto/supplier';
import {
  CreateSupplierUseCase,
  UpdateSupplierUseCase,
  GetSupplierByIdUseCase,
  ListSuppliersUseCase,
  ListSuppliersResult,
  ChangeSupplierStatusUseCase,
  DeleteSupplierUseCase,
} from '../use-cases/supplier';

@Injectable()
export class SupplierService {
  private readonly createSupplierUseCase: CreateSupplierUseCase;
  private readonly updateSupplierUseCase: UpdateSupplierUseCase;
  private readonly getSupplierByIdUseCase: GetSupplierByIdUseCase;
  private readonly listSuppliersUseCase: ListSuppliersUseCase;
  private readonly changeSupplierStatusUseCase: ChangeSupplierStatusUseCase;
  private readonly deleteSupplierUseCase: DeleteSupplierUseCase;

  constructor(@Inject('SupplierRepository') supplierRepository: SupplierRepository) {
    this.createSupplierUseCase = new CreateSupplierUseCase(supplierRepository);
    this.updateSupplierUseCase = new UpdateSupplierUseCase(supplierRepository);
    this.getSupplierByIdUseCase = new GetSupplierByIdUseCase(supplierRepository);
    this.listSuppliersUseCase = new ListSuppliersUseCase(supplierRepository);
    this.changeSupplierStatusUseCase = new ChangeSupplierStatusUseCase(supplierRepository);
    this.deleteSupplierUseCase = new DeleteSupplierUseCase(supplierRepository);
  }

  async createSupplier(dto: CreateSupplierDto): Promise<SupplierResponseDto> {
    return this.createSupplierUseCase.execute(dto);
  }

  async updateSupplier(id: string, dto: UpdateSupplierDto): Promise<SupplierResponseDto> {
    return this.updateSupplierUseCase.execute(id, dto);
  }

  async getSupplierById(id: string): Promise<SupplierResponseDto> {
    return this.getSupplierByIdUseCase.execute(id);
  }

  async listSuppliers(query: SupplierQueryDto): Promise<ListSuppliersResult> {
    return this.listSuppliersUseCase.execute(query);
  }

  async changeSupplierStatus(id: string, dto: ChangeSupplierStatusDto): Promise<SupplierResponseDto> {
    return this.changeSupplierStatusUseCase.execute(id, dto);
  }

  async deleteSupplier(id: string): Promise<void> {
    return this.deleteSupplierUseCase.execute(id);
  }
}
