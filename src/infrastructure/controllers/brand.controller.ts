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
import { BrandService } from '../../application/services/brand.service';
import {
  CreateBrandDto,
  UpdateBrandDto,
  BrandResponseDto,
  BrandQueryDto,
  ChangeBrandStatusDto,
} from '../../application/dto/brand';
import { ListBrandsResult } from '../../application/use-cases/brand';

@ApiTags('brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva marca' })
  @ApiResponse({ status: 201, description: 'Marca creada exitosamente', type: BrandResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe una marca con el mismo nombre' })
  async createBrand(@Body() createBrandDto: CreateBrandDto): Promise<BrandResponseDto> {
    return this.brandService.createBrand(createBrandDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener marca por ID' })
  @ApiParam({ name: 'id', description: 'ID único de la marca', type: 'string' })
  @ApiResponse({ status: 200, description: 'Marca encontrada', type: BrandResponseDto })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  async getBrandById(@Param('id') id: string): Promise<BrandResponseDto | null> {
    return this.brandService.getBrandById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar marcas con filtros y paginación' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por estado' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nombre' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', type: 'number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página', type: 'number' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo de ordenamiento' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden (asc/desc)' })
  @ApiResponse({ status: 200, description: 'Lista de marcas obtenida exitosamente' })
  async listBrands(@Query() query: BrandQueryDto): Promise<ListBrandsResult> {
    return this.brandService.listBrands(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de una marca (actualización parcial)' })
  @ApiParam({ name: 'id', description: 'ID único de la marca', type: 'string' })
  @ApiResponse({ status: 200, description: 'Marca actualizada exitosamente', type: BrandResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe una marca con el mismo nombre' })
  async updateBrand(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<BrandResponseDto> {
    return this.brandService.updateBrand(id, updateBrandDto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Cambiar estado de una marca' })
  @ApiParam({ name: 'id', description: 'ID único de la marca', type: 'string' })
  @ApiResponse({ status: 200, description: 'Estado de marca cambiado exitosamente', type: BrandResponseDto })
  @ApiResponse({ status: 400, description: 'Estado inválido' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  async changeBrandStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeBrandStatusDto,
  ): Promise<BrandResponseDto> {
    return this.brandService.changeBrandStatus(id, changeStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una marca (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID único de la marca', type: 'string' })
  @ApiResponse({ status: 204, description: 'Marca eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Marca no encontrada' })
  async deleteBrand(@Param('id') id: string): Promise<BrandResponseDto> {
    return this.brandService.deleteBrand(id);
  }
}
