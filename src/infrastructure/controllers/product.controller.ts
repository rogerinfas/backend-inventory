import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  HttpCode, 
  HttpStatus,
  Req
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiGoneResponse
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ProductService } from '../../application/services/product.service';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  ProductResponseDto, 
  ProductQueryDto,
  ListProductsResponseDto,
  AddStockDto,
  RemoveStockDto,
  UpdateStockDto
} from '../../application/dto/product';
import type { ListProductsResult } from '../../application/use-cases/product';
import type { StoreFilter } from '../../domain/value-objects';
import { StoreScoped } from '../decorators';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear un nuevo producto',
    description: 'Crea un nuevo producto en el inventario con la información proporcionada. El SKU debe ser único en todo el sistema.'
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'Datos del producto a crear',
    examples: {
      laptop: {
        summary: 'Laptop Dell',
        description: 'Ejemplo de creación de una laptop',
        value: {
          storeId: '123e4567-e89b-12d3-a456-426614174000',
          sku: 'LAPTOP-DELL-001',
          name: 'Laptop Dell Inspiron 15 3000',
          description: 'Laptop Dell Inspiron 15 3000 con procesador Intel Core i5, 8GB RAM, 256GB SSD',
          purchasePrice: 1200.50,
          salePrice: 1500.00,
          minimumStock: 10,
          maximumStock: 100,
          unitOfMeasure: 'UNIT',
          imageUrl: 'https://example.com/images/laptop-dell-001.jpg',
          categoryId: '123e4567-e89b-12d3-a456-426614174001',
          brandId: '123e4567-e89b-12d3-a456-426614174002'
        }
      },
      mouse: {
        summary: 'Mouse Logitech',
        description: 'Ejemplo de creación de un mouse',
        value: {
          storeId: '123e4567-e89b-12d3-a456-426614174000',
          sku: 'MOUSE-LOGI-001',
          name: 'Mouse Logitech MX Master 3',
          description: 'Mouse inalámbrico Logitech MX Master 3 con sensor de alta precisión',
          purchasePrice: 89.99,
          salePrice: 129.99,
          minimumStock: 20,
          unitOfMeasure: 'UNIT'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Producto creado exitosamente', 
    type: ProductResponseDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['El SKU debe tener al menos 3 caracteres'],
        error: 'Bad Request'
      }
    }
  })
  @ApiConflictResponse({ 
    description: 'Ya existe un producto con el mismo SKU',
    schema: {
      example: {
        statusCode: 409,
        message: 'Ya existe un producto con SKU: LAPTOP-DELL-001',
        error: 'Conflict'
      }
    }
  })
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productService.createProduct(createProductDto);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener producto por ID',
    description: 'Obtiene la información completa de un producto específico por su ID único.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Producto encontrado', 
    type: ProductResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Producto no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Producto con ID 123e4567-e89b-12d3-a456-426614174000 no encontrado',
        error: 'Not Found'
      }
    }
  })
  @StoreScoped()
  async getProductById(
    @Param('id') id: string,
    @Req() request: Request
  ): Promise<ProductResponseDto | null> {
    const storeFilter = request['storeFilter'] as StoreFilter;
    return this.productService.getProductById(id, storeFilter);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar productos con filtros y paginación',
    description: 'Obtiene una lista paginada de productos con filtros opcionales. Permite buscar por nombre, SKU o descripción, filtrar por tienda, categoría, marca, estado y stock.'
  })
  @ApiQuery({ 
    name: 'storeId', 
    required: false, 
    description: 'ID de la tienda para filtrar productos',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiQuery({ 
    name: 'categoryId', 
    required: false, 
    description: 'ID de la categoría para filtrar productos',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid'
  })
  @ApiQuery({ 
    name: 'brandId', 
    required: false, 
    description: 'ID de la marca para filtrar productos',
    example: '123e4567-e89b-12d3-a456-426614174002',
    format: 'uuid'
  })
  @ApiQuery({ 
    name: 'isActive', 
    required: false, 
    description: 'Filtrar por estado activo del producto',
    example: true,
    type: 'boolean'
  })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    description: 'Búsqueda por nombre, SKU o descripción del producto',
    example: 'laptop'
  })
  @ApiQuery({ 
    name: 'lowStock', 
    required: false, 
    description: 'Filtrar productos con stock bajo (stock actual <= stock mínimo)',
    example: true,
    type: 'boolean'
  })
  @ApiQuery({ 
    name: 'outOfStock', 
    required: false, 
    description: 'Filtrar productos sin stock (stock actual = 0)',
    example: true,
    type: 'boolean'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Número de página para paginación',
    example: 1,
    type: 'integer',
    minimum: 1,
    maximum: 1000
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Límite de resultados por página',
    example: 10,
    type: 'integer',
    minimum: 1,
    maximum: 100
  })
  @ApiQuery({ 
    name: 'sortBy', 
    required: false, 
    description: 'Campo para ordenar los resultados',
    example: 'name',
    enum: ['name', 'sku', 'currentStock', 'salePrice', 'createdAt', 'updatedAt']
  })
  @ApiQuery({ 
    name: 'sortOrder', 
    required: false, 
    description: 'Orden de clasificación',
    example: 'desc',
    enum: ['asc', 'desc']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de productos con metadatos de paginación', 
    type: ListProductsResponseDto 
  })
  @StoreScoped()
  async listProducts(
    @Query() query: ProductQueryDto,
    @Req() request: Request
  ): Promise<ListProductsResult> {
    const storeFilter = request['storeFilter'] as StoreFilter;
    return this.productService.listProducts(query, storeFilter);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar datos de un producto (actualización parcial)',
    description: 'Actualiza parcialmente los datos de un producto existente. Solo se actualizarán los campos proporcionados.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Datos del producto a actualizar (campos opcionales)',
    examples: {
      updatePrice: {
        summary: 'Actualizar precios',
        description: 'Ejemplo de actualización de precios',
        value: {
          purchasePrice: 1300.75,
          salePrice: 1600.00
        }
      },
      updateStock: {
        summary: 'Actualizar stock mínimo',
        description: 'Ejemplo de actualización de stock mínimo',
        value: {
          minimumStock: 15,
          maximumStock: 150
        }
      },
      updateInfo: {
        summary: 'Actualizar información',
        description: 'Ejemplo de actualización de información del producto',
        value: {
          name: 'Laptop Dell Inspiron 15 3000 Actualizada',
          description: 'Laptop Dell Inspiron 15 3000 con procesador Intel Core i7, 16GB RAM, 512GB SSD',
          imageUrl: 'https://example.com/images/laptop-dell-001-updated.jpg'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Producto actualizado exitosamente', 
    type: ProductResponseDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['El precio de compra debe ser mayor o igual a 0'],
        error: 'Bad Request'
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Producto no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Producto con ID 123e4567-e89b-12d3-a456-426614174000 no encontrado',
        error: 'Not Found'
      }
    }
  })
  @ApiGoneResponse({ 
    description: 'Producto inactivo',
    schema: {
      example: {
        statusCode: 410,
        message: 'No se puede realizar la operación. El producto con ID 123e4567-e89b-12d3-a456-426614174000 está inactivo',
        error: 'Gone'
      }
    }
  })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar un producto (soft delete)',
    description: 'Desactiva un producto existente (soft delete). El producto no se elimina físicamente de la base de datos, solo se marca como inactivo.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Producto eliminado exitosamente' 
  })
  @ApiNotFoundResponse({ 
    description: 'Producto no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Producto con ID 123e4567-e89b-12d3-a456-426614174000 no encontrado',
        error: 'Not Found'
      }
    }
  })
  @ApiGoneResponse({ 
    description: 'Producto ya inactivo',
    schema: {
      example: {
        statusCode: 410,
        message: 'No se puede realizar la operación. El producto con ID 123e4567-e89b-12d3-a456-426614174000 está inactivo',
        error: 'Gone'
      }
    }
  })
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }

  @Post(':id/stock/add')
  @ApiOperation({ 
    summary: 'Agregar stock a un producto',
    description: 'Aumenta la cantidad de stock disponible de un producto específico.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiBody({
    type: AddStockDto,
    description: 'Cantidad de stock a agregar',
    examples: {
      addStock: {
        summary: 'Agregar stock',
        description: 'Ejemplo de adición de stock',
        value: {
          quantity: 25,
          reason: 'Compra de mercadería'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Stock agregado exitosamente', 
    type: ProductResponseDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Cantidad inválida',
    schema: {
      example: {
        statusCode: 400,
        message: ['La cantidad debe ser mayor o igual a 1'],
        error: 'Bad Request'
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Producto no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Producto con ID 123e4567-e89b-12d3-a456-426614174000 no encontrado',
        error: 'Not Found'
      }
    }
  })
  @ApiGoneResponse({ 
    description: 'Producto inactivo',
    schema: {
      example: {
        statusCode: 410,
        message: 'No se puede realizar la operación. El producto con ID 123e4567-e89b-12d3-a456-426614174000 está inactivo',
        error: 'Gone'
      }
    }
  })
  async addStock(
    @Param('id') id: string,
    @Body() addStockDto: AddStockDto,
  ): Promise<ProductResponseDto> {
    return this.productService.addStock(id, addStockDto);
  }

  @Post(':id/stock/remove')
  @ApiOperation({ 
    summary: 'Remover stock de un producto',
    description: 'Disminuye la cantidad de stock disponible de un producto específico. Verifica que haya suficiente stock antes de realizar la operación.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiBody({
    type: RemoveStockDto,
    description: 'Cantidad de stock a remover',
    examples: {
      removeStock: {
        summary: 'Remover stock',
        description: 'Ejemplo de remoción de stock',
        value: {
          quantity: 5,
          reason: 'Venta realizada'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Stock removido exitosamente', 
    type: ProductResponseDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Cantidad inválida o stock insuficiente',
    schema: {
      example: {
        statusCode: 400,
        message: 'Stock insuficiente. Solicitado: 10, Disponible: 5',
        error: 'Bad Request'
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Producto no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Producto con ID 123e4567-e89b-12d3-a456-426614174000 no encontrado',
        error: 'Not Found'
      }
    }
  })
  @ApiGoneResponse({ 
    description: 'Producto inactivo',
    schema: {
      example: {
        statusCode: 410,
        message: 'No se puede realizar la operación. El producto con ID 123e4567-e89b-12d3-a456-426614174000 está inactivo',
        error: 'Gone'
      }
    }
  })
  async removeStock(
    @Param('id') id: string,
    @Body() removeStockDto: RemoveStockDto,
  ): Promise<ProductResponseDto> {
    return this.productService.removeStock(id, removeStockDto);
  }

  @Patch(':id/stock')
  @ApiOperation({ 
    summary: 'Actualizar stock de un producto',
    description: 'Establece una nueva cantidad de stock para un producto específico, reemplazando el valor anterior.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiBody({
    type: UpdateStockDto,
    description: 'Nueva cantidad de stock',
    examples: {
      updateStock: {
        summary: 'Actualizar stock',
        description: 'Ejemplo de actualización de stock',
        value: {
          quantity: 50,
          reason: 'Inventario inicial'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Stock actualizado exitosamente', 
    type: ProductResponseDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Cantidad inválida',
    schema: {
      example: {
        statusCode: 400,
        message: ['La cantidad debe ser mayor o igual a 0'],
        error: 'Bad Request'
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Producto no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Producto con ID 123e4567-e89b-12d3-a456-426614174000 no encontrado',
        error: 'Not Found'
      }
    }
  })
  @ApiGoneResponse({ 
    description: 'Producto inactivo',
    schema: {
      example: {
        statusCode: 410,
        message: 'No se puede realizar la operación. El producto con ID 123e4567-e89b-12d3-a456-426614174000 está inactivo',
        error: 'Gone'
      }
    }
  })
  async updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<ProductResponseDto> {
    return this.productService.updateStock(id, updateStockDto);
  }

  @Patch(':id/stores/:storeId/reserved-stock')
  @ApiOperation({
    summary: 'Actualizar reservedStock de un producto',
    description: 'Actualiza el stock reservado del producto. Debe ser menor o igual al currentStock.'
  })
  @ApiParam({ name: 'id', description: 'ID del producto', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiParam({ name: 'storeId', description: 'ID de la tienda', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reservedStock: { type: 'number', example: 5, minimum: 0 },
      },
      required: ['reservedStock']
    }
  })
  @ApiResponse({ status: 200, description: 'Reserved stock actualizado' })
  @ApiBadRequestResponse({ description: 'reservedStock inválido o mayor a currentStock' })
  async updateReservedStock(
    @Param('id') id: string,
    @Param('storeId') storeId: string,
    @Body() body: { reservedStock: number },
  ) {
    return this.productService.updateReservedStock(id, storeId, body.reservedStock);
  }

  // TODO: Implementar endpoint para consultar historial de movimientos de inventario
  // @Get(':id/inventory-movements')
  // @ApiOperation({
  //   summary: 'Obtener historial de movimientos de inventario',
  //   description: 'Obtiene el historial completo de movimientos de stock de un producto',
  // })
  // @ApiParam({
  //   name: 'id',
  //   description: 'ID único del producto',
  //   example: '123e4567-e89b-12d3-a456-426614174000',
  // })
  // @ApiQuery({
  //   name: 'page',
  //   required: false,
  //   description: 'Número de página para paginación',
  //   example: 1,
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   required: false,
  //   description: 'Cantidad de elementos por página',
  //   example: 10,
  // })
  // @ApiQuery({
  //   name: 'type',
  //   required: false,
  //   description: 'Filtrar por tipo de movimiento',
  //   enum: ['ENTRY', 'EXIT', 'ADJUSTMENT'],
  //   example: 'ENTRY',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Historial de movimientos obtenido exitosamente',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       data: {
  //         type: 'array',
  //         items: {
  //           type: 'object',
  //           properties: {
  //             id: { type: 'string' },
  //             type: { type: 'string', enum: ['ENTRY', 'EXIT', 'ADJUSTMENT'] },
  //             quantity: { type: 'number' },
  //             previousStock: { type: 'number' },
  //             newStock: { type: 'number' },
  //             reason: { type: 'string' },
  //             userId: { type: 'string' },
  //             createdAt: { type: 'string', format: 'date-time' },
  //           },
  //         },
  //       },
  //       pagination: {
  //         type: 'object',
  //         properties: {
  //           page: { type: 'number' },
  //           limit: { type: 'number' },
  //           total: { type: 'number' },
  //           totalPages: { type: 'number' },
  //         },
  //       },
  //     },
  //   },
  // })
  // async getInventoryMovements(
  //   @Param('id') id: string,
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10,
  //   @Query('type') type?: string,
  // ): Promise<any> {
  //   return this.productService.getInventoryMovements(id, page, limit, type);
  // }
}
