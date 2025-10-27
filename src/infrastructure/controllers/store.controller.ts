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
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import type { Request } from 'express';
import { StoreService } from '../../application/services/store.service';
import {
  CreateStoreDto,
  UpdateStoreDto,
  StoreResponseDto,
  StoreQueryDto,
  ChangeStoreStatusDto,
} from '../../application/dto/store';
import { ListStoresResult } from '../../application/use-cases/store';
import type { StoreFilter } from '../../domain/value-objects';
import { StoreScoped } from '../decorators';

@ApiTags('stores')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva tienda' })
  @ApiResponse({ status: 201, description: 'Tienda creada exitosamente', type: StoreResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe una tienda con el mismo RUC o email' })
  async createStore(@Body() createStoreDto: CreateStoreDto): Promise<StoreResponseDto> {
    return this.storeService.createStore(createStoreDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tienda por ID' })
  @ApiParam({ name: 'id', description: 'ID único de la tienda', type: 'string' })
  @ApiResponse({ status: 200, description: 'Tienda encontrada', type: StoreResponseDto })
  @ApiResponse({ status: 404, description: 'Tienda no encontrada' })
  @StoreScoped()
  async getStoreById(
    @Param('id') id: string,
    @Req() request: Request
  ): Promise<StoreResponseDto | null> {
    const storeFilter = request['storeFilter'] as StoreFilter;
    return this.storeService.getStoreById(id, storeFilter);
  }

  @Get('ruc/:ruc')
  @ApiOperation({ summary: 'Obtener tienda por RUC' })
  @ApiParam({ name: 'ruc', description: 'RUC de la tienda', type: 'string' })
  @ApiResponse({ status: 200, description: 'Tienda encontrada', type: StoreResponseDto })
  @ApiResponse({ status: 404, description: 'Tienda no encontrada' })
  @StoreScoped()
  async getStoreByRuc(
    @Param('ruc') ruc: string,
    @Req() request: Request
  ): Promise<StoreResponseDto | null> {
    const storeFilter = request['storeFilter'] as StoreFilter;
    return this.storeService.getStoreByRuc(ruc, storeFilter);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tiendas con filtros y paginación' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por estado' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nombre comercial, razón social o RUC' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', type: 'number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página', type: 'number' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo de ordenamiento' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden (asc/desc)' })
  @ApiResponse({ status: 200, description: 'Lista de tiendas obtenida exitosamente' })
  @StoreScoped()
  async listStores(
    @Query() query: StoreQueryDto,
    @Req() request: Request
  ): Promise<ListStoresResult> {
    const storeFilter = request['storeFilter'] as StoreFilter;
    return this.storeService.listStores(query, storeFilter);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de una tienda (actualización parcial)' })
  @ApiParam({ name: 'id', description: 'ID único de la tienda', type: 'string' })
  @ApiResponse({ status: 200, description: 'Tienda actualizada exitosamente', type: StoreResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Tienda no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe una tienda con el mismo email' })
  async updateStore(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    return this.storeService.updateStore(id, updateStoreDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambiar estado de una tienda (actualización parcial)' })
  @ApiParam({ name: 'id', description: 'ID único de la tienda', type: 'string' })
  @ApiResponse({ status: 200, description: 'Estado de tienda cambiado exitosamente', type: StoreResponseDto })
  @ApiResponse({ status: 400, description: 'Estado inválido o cambio no permitido' })
  @ApiResponse({ status: 404, description: 'Tienda no encontrada' })
  async changeStoreStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStoreStatusDto,
  ): Promise<StoreResponseDto> {
    return this.storeService.changeStoreStatus(id, changeStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una tienda (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID único de la tienda', type: 'string' })
  @ApiResponse({ status: 204, description: 'Tienda eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tienda no encontrada' })
  async deleteStore(@Param('id') id: string): Promise<StoreResponseDto> {
    return this.storeService.deleteStore(id);
  }
}
