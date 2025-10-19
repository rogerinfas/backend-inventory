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
import { CategoryService } from '../../application/services/category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
  CategoryQueryDto,
  ChangeCategoryStatusDto,
} from '../../application/dto/category';
import { ListCategoriesResult } from '../../application/use-cases/category';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente', type: CategoryResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe una categoría con el mismo nombre' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener categoría por ID' })
  @ApiParam({ name: 'id', description: 'ID único de la categoría', type: 'string' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada', type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async getCategoryById(@Param('id') id: string): Promise<CategoryResponseDto | null> {
    return this.categoryService.getCategoryById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar categorías con filtros y paginación' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por estado' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nombre o descripción' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', type: 'number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página', type: 'number' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo de ordenamiento' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden (asc/desc)' })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida exitosamente' })
  async listCategories(@Query() query: CategoryQueryDto): Promise<ListCategoriesResult> {
    return this.categoryService.listCategories(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de una categoría (actualización parcial)' })
  @ApiParam({ name: 'id', description: 'ID único de la categoría', type: 'string' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada exitosamente', type: CategoryResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe una categoría con el mismo nombre' })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Cambiar estado de una categoría' })
  @ApiParam({ name: 'id', description: 'ID único de la categoría', type: 'string' })
  @ApiResponse({ status: 200, description: 'Estado de categoría cambiado exitosamente', type: CategoryResponseDto })
  @ApiResponse({ status: 400, description: 'Estado inválido' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async changeCategoryStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeCategoryStatusDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.changeCategoryStatus(id, changeStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una categoría (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID único de la categoría', type: 'string' })
  @ApiResponse({ status: 204, description: 'Categoría eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async deleteCategory(@Param('id') id: string): Promise<CategoryResponseDto> {
    return this.categoryService.deleteCategory(id);
  }
}
