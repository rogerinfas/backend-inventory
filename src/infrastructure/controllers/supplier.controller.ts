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
import { SupplierService } from '../../application/services/supplier.service';
import {
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierResponseDto,
  SupplierQueryDto,
  ChangeSupplierStatusDto,
} from '../../application/dto/supplier';
import { ListSuppliersResult } from '../../application/use-cases/supplier';

@ApiTags('suppliers')
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({ status: 201, description: 'Proveedor creado exitosamente', type: SupplierResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe un proveedor para esta tienda y persona' })
  async createSupplier(@Body() createSupplierDto: CreateSupplierDto): Promise<SupplierResponseDto> {
    return this.supplierService.createSupplier(createSupplierDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener proveedor por ID' })
  @ApiParam({ name: 'id', description: 'ID único del proveedor', type: 'string' })
  @ApiResponse({ status: 200, description: 'Proveedor encontrado exitosamente', type: SupplierResponseDto })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  async getSupplierById(@Param('id') id: string): Promise<SupplierResponseDto> {
    return this.supplierService.getSupplierById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un proveedor (actualización parcial)' })
  @ApiParam({ name: 'id', description: 'ID único del proveedor', type: 'string' })
  @ApiResponse({ status: 200, description: 'Proveedor actualizado exitosamente', type: SupplierResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  @ApiResponse({ status: 410, description: 'Proveedor eliminado' })
  async updateSupplier(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<SupplierResponseDto> {
    return this.supplierService.updateSupplier(id, updateSupplierDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar proveedores con filtros y paginación' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filtrar por ID de tienda' })
  @ApiQuery({ name: 'personId', required: false, description: 'Filtrar por ID de persona' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por estado' })
  @ApiQuery({ name: 'search', required: false, description: 'Término de búsqueda' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Límite de elementos por página' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el cual ordenar' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Dirección del ordenamiento' })
  @ApiResponse({ status: 200, description: 'Lista de proveedores obtenida exitosamente' })
  async listSuppliers(@Query() query: SupplierQueryDto): Promise<ListSuppliersResult> {
    return this.supplierService.listSuppliers(query);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambiar estado de un proveedor (actualización parcial)' })
  @ApiParam({ name: 'id', description: 'ID único del proveedor', type: 'string' })
  @ApiResponse({ status: 200, description: 'Estado de proveedor cambiado exitosamente', type: SupplierResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  @ApiResponse({ status: 410, description: 'Proveedor eliminado' })
  async changeSupplierStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeSupplierStatusDto,
  ): Promise<SupplierResponseDto> {
    return this.supplierService.changeSupplierStatus(id, changeStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un proveedor (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID único del proveedor', type: 'string' })
  @ApiResponse({ status: 204, description: 'Proveedor eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  @ApiResponse({ status: 410, description: 'Proveedor ya eliminado' })
  async deleteSupplier(@Param('id') id: string): Promise<void> {
    return this.supplierService.deleteSupplier(id);
  }
}
