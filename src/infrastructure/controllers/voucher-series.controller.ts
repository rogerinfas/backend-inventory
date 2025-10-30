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
import { VoucherSeriesService } from '../../application/services/voucher-series.service';
import {
  CreateVoucherSeriesDto,
  UpdateVoucherSeriesDto,
  VoucherSeriesResponseDto,
  VoucherSeriesQueryDto,
  IncrementVoucherSeriesDto,
} from '../../application/dto/voucher-series';
import { ListVoucherSeriesResult, NextNumberResult } from '../../application/use-cases/voucher-series';

@ApiTags('voucher-series')
@Controller('voucher-series')
export class VoucherSeriesController {
  constructor(private readonly voucherSeriesService: VoucherSeriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva serie de comprobantes' })
  @ApiResponse({ status: 201, description: 'Serie de comprobantes creada exitosamente', type: VoucherSeriesResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe una serie con el mismo tipo y serie' })
  async createVoucherSeries(@Body() createVoucherSeriesDto: CreateVoucherSeriesDto): Promise<VoucherSeriesResponseDto> {
    return this.voucherSeriesService.createVoucherSeries(createVoucherSeriesDto);
  }

  // IMPORTANTE: La ruta genérica @Get() debe ir ANTES que @Get(':id')
  // para que NestJS pueda hacer match correctamente
  @Get()
  @ApiOperation({ summary: 'Listar series de comprobantes con filtros y paginación' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filtrar por ID de tienda' })
  @ApiQuery({ name: 'voucherType', required: false, description: 'Filtrar por tipo de comprobante' })
  @ApiQuery({ name: 'series', required: false, description: 'Buscar por serie' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', type: 'number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página', type: 'number' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo de ordenamiento' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden (asc/desc)' })
  @ApiResponse({ status: 200, description: 'Lista de series de comprobantes obtenida exitosamente' })
  async listVoucherSeries(@Query() query: VoucherSeriesQueryDto): Promise<ListVoucherSeriesResult> {
    return this.voucherSeriesService.listVoucherSeries(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener serie de comprobantes por ID' })
  @ApiParam({ name: 'id', description: 'ID único de la serie de comprobantes', type: 'string' })
  @ApiResponse({ status: 200, description: 'Serie de comprobantes encontrada', type: VoucherSeriesResponseDto })
  @ApiResponse({ status: 404, description: 'Serie de comprobantes no encontrada' })
  async getVoucherSeriesById(@Param('id') id: string): Promise<VoucherSeriesResponseDto | null> {
    return this.voucherSeriesService.getVoucherSeriesById(id);
  }

  // Rutas específicas PRIMERO (con segmentos fijos como ':id/next-number')
  @Get(':id/next-number')
  @ApiOperation({ summary: 'Obtener el siguiente número de una serie de comprobantes' })
  @ApiParam({ name: 'id', description: 'ID único de la serie de comprobantes', type: 'string' })
  @ApiResponse({ status: 200, description: 'Siguiente número obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Serie de comprobantes no encontrada' })
  async getNextNumber(@Param('id') id: string): Promise<NextNumberResult> {
    return this.voucherSeriesService.getNextNumber(id);
  }

  @Put(':id/increment')
  @ApiOperation({ summary: 'Incrementar el número actual de una serie de comprobantes' })
  @ApiParam({ name: 'id', description: 'ID único de la serie de comprobantes', type: 'string' })
  @ApiResponse({ status: 200, description: 'Número incrementado exitosamente', type: VoucherSeriesResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Serie de comprobantes no encontrada' })
  async incrementVoucherSeries(
    @Param('id') id: string,
    @Body() incrementDto: IncrementVoucherSeriesDto,
  ): Promise<VoucherSeriesResponseDto> {
    return this.voucherSeriesService.incrementVoucherSeries(id, incrementDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de una serie de comprobantes (actualización parcial)' })
  @ApiParam({ name: 'id', description: 'ID único de la serie de comprobantes', type: 'string' })
  @ApiResponse({ status: 200, description: 'Serie de comprobantes actualizada exitosamente', type: VoucherSeriesResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Serie de comprobantes no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe una serie con el mismo tipo y serie' })
  async updateVoucherSeries(
    @Param('id') id: string,
    @Body() updateVoucherSeriesDto: UpdateVoucherSeriesDto,
  ): Promise<VoucherSeriesResponseDto> {
    return this.voucherSeriesService.updateVoucherSeries(id, updateVoucherSeriesDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una serie de comprobantes' })
  @ApiParam({ name: 'id', description: 'ID único de la serie de comprobantes', type: 'string' })
  @ApiResponse({ status: 204, description: 'Serie de comprobantes eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Serie de comprobantes no encontrada' })
  async deleteVoucherSeries(@Param('id') id: string): Promise<void> {
    return this.voucherSeriesService.deleteVoucherSeries(id);
  }
}
