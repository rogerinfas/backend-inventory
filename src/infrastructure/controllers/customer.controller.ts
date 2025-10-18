import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CustomerService } from '../../application/services/customer.service';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerResponseDto,
  CustomerQueryDto,
  ChangeCustomerStatusDto,
} from '../../application/dto/customer';
import { ListCustomersResult } from '../../application/use-cases/customer';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente', type: CustomerResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe un cliente para esta tienda y persona' })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto): Promise<CustomerResponseDto> {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID único del cliente', type: 'string' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado exitosamente', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async getCustomerById(@Param('id') id: string): Promise<CustomerResponseDto> {
    return this.customerService.getCustomerById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un cliente (actualización parcial)' })
  @ApiParam({ name: 'id', description: 'ID único del cliente', type: 'string' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado exitosamente', type: CustomerResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiResponse({ status: 410, description: 'Cliente eliminado' })
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes con filtros y paginación' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filtrar por ID de tienda' })
  @ApiQuery({ name: 'personId', required: false, description: 'Filtrar por ID de persona' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por estado' })
  @ApiQuery({ name: 'search', required: false, description: 'Término de búsqueda' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Límite de elementos por página' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el cual ordenar' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Dirección del ordenamiento' })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida exitosamente' })
  async listCustomers(@Query() query: CustomerQueryDto): Promise<ListCustomersResult> {
    return this.customerService.listCustomers(query);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambiar estado de un cliente (actualización parcial)' })
  @ApiParam({ name: 'id', description: 'ID único del cliente', type: 'string' })
  @ApiResponse({ status: 200, description: 'Estado de cliente cambiado exitosamente', type: CustomerResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiResponse({ status: 410, description: 'Cliente eliminado' })
  async changeCustomerStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeCustomerStatusDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.changeCustomerStatus(id, changeStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un cliente (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID único del cliente', type: 'string' })
  @ApiResponse({ status: 204, description: 'Cliente eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiResponse({ status: 410, description: 'Cliente ya eliminado' })
  async deleteCustomer(@Param('id') id: string): Promise<void> {
    return this.customerService.deleteCustomer(id);
  }
}
