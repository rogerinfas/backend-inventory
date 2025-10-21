import { Controller, Post, Patch, Put, Get, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, ApiBadRequestResponse, ApiNotFoundResponse, ApiCreatedResponse, ApiOkResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { SaleService } from '../../application/services/sale.service';
import { CreateSaleDto, UpdateSaleDto, UpdateSaleStatusDto, SaleResponseDto, SaleQueryDto, ListSalesResponseDto } from '../../application/dto/sale';

@ApiTags('Sales')
@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear una nueva venta',
    description: 'Crea una nueva venta con sus detalles. La venta se crea en estado PENDING y se incrementa el reservedStock de los productos.',
  })
  @ApiBody({ type: CreateSaleDto, description: 'Datos de la venta a crear' })
  @ApiCreatedResponse({
    description: 'Venta creada exitosamente',
    type: SaleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos o stock insuficiente',
    schema: {
      example: {
        statusCode: 400,
        message: ['Stock insuficiente para el producto 123e4567-e89b-12d3-a456-426614174000. Disponible: 5, Solicitado: 10'],
        error: 'Bad Request'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Tienda, cliente, usuario o producto no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Tienda con ID 123e4567-e89b-12d3-a456-426614174000 no encontrada',
        error: 'Not Found'
      }
    }
  })
  async create(@Body() createSaleDto: CreateSaleDto): Promise<SaleResponseDto> {
    try {
      return await this.saleService.create(createSaleDto);
    } catch (error) {
      // El global filter manejará el error, re-lanzarlo
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar ventas',
    description: 'Obtiene una lista paginada de ventas con filtros opcionales.',
  })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filtrar por ID de tienda' })
  @ApiQuery({ name: 'customerId', required: false, description: 'Filtrar por ID de cliente' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrar por ID de usuario' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por estado de venta' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin' })
  @ApiQuery({ name: 'search', required: false, description: 'Búsqueda por documento o notas' })
  @ApiQuery({ name: 'offset', required: false, description: 'Registros a omitir' })
  @ApiQuery({ name: 'limit', required: false, description: 'Límite de registros' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo de ordenamiento' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden (asc/desc)' })
  @ApiOkResponse({
    description: 'Lista de ventas obtenida exitosamente',
    type: ListSalesResponseDto,
  })
  async findAll(@Query() query: SaleQueryDto): Promise<ListSalesResponseDto> {
    try {
      return await this.saleService.findAll(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener venta por ID',
    description: 'Obtiene los detalles de una venta específica por su ID.',
  })
  @ApiParam({ name: 'id', description: 'ID de la venta', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiOkResponse({
    description: 'Venta encontrada exitosamente',
    type: SaleResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Venta no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Venta con ID 123e4567-e89b-12d3-a456-426614174000 no encontrada',
        error: 'Not Found'
      }
    }
  })
  async findById(@Param('id') id: string): Promise<SaleResponseDto> {
    try {
      return await this.saleService.findById(id);
    } catch (error) {
      throw error;
    }
  }
x
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar venta',
    description: 'Actualiza los datos de una venta existente. Solo se pueden actualizar ventas en estado PENDING.',
  })
  @ApiParam({ name: 'id', description: 'ID de la venta', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateSaleDto, description: 'Datos a actualizar' })
  @ApiOkResponse({
    description: 'Venta actualizada exitosamente',
    type: SaleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o venta no se puede actualizar',
    schema: {
      example: {
        statusCode: 400,
        message: 'Solo se pueden actualizar ventas en estado PENDING',
        error: 'Bad Request'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Venta no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Venta con ID 123e4567-e89b-12d3-a456-426614174000 no encontrada',
        error: 'Not Found'
      }
    }
  })
  async update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
  ): Promise<SaleResponseDto> {
    try {
      return await this.saleService.update(id, updateSaleDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar estado de una venta',
    description: 'Actualiza el estado de una venta. Los cambios de estado afectan el stock de los productos según las reglas de negocio.',
  })
  @ApiParam({ name: 'id', description: 'ID de la venta', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateSaleStatusDto, description: 'Nuevo estado de la venta' })
  @ApiResponse({ status: 200, description: 'Estado de venta actualizado exitosamente', type: SaleResponseDto })
  @ApiBadRequestResponse({
    description: 'Transición de estado inválida',
    schema: {
      example: {
        statusCode: 400,
        message: 'No se puede cambiar el estado de COMPLETED a PENDING',
        error: 'Bad Request'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Venta no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Venta con ID 123e4567-e89b-12d3-a456-426614174000 no encontrada',
        error: 'Not Found'
      }
    }
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateSaleStatusDto: UpdateSaleStatusDto,
  ): Promise<SaleResponseDto> {
    try {
      return await this.saleService.updateStatus(id, updateSaleStatusDto);
    } catch (error) {
      // El global filter manejará el error, re-lanzarlo
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar venta',
    description: 'Elimina una venta. Solo se pueden eliminar ventas en estado PENDING.',
  })
  @ApiParam({ name: 'id', description: 'ID de la venta', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiNoContentResponse({
    description: 'Venta eliminada exitosamente',
  })
  @ApiBadRequestResponse({
    description: 'Venta no se puede eliminar',
    schema: {
      example: {
        statusCode: 400,
        message: 'Solo se pueden eliminar ventas en estado PENDING',
        error: 'Bad Request'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Venta no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Venta con ID 123e4567-e89b-12d3-a456-426614174000 no encontrada',
        error: 'Not Found'
      }
    }
  })
  async delete(@Param('id') id: string): Promise<void> {
    try {
      return await this.saleService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
