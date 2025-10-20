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
  HttpStatus 
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
import { PurchaseService } from '../../application/services/purchase.service';
import { 
  CreatePurchaseDto, 
  UpdatePurchaseDto, 
  PurchaseQueryDto, 
  PurchaseResponseDto,
  ListPurchasesResponseDto
} from '../../application/dto/purchase';
import { ListPurchasesResult } from '../../application/use-cases/purchase';

@ApiTags('Purchases')
@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nueva compra',
    description: 'Crea una nueva compra con sus detalles de forma atómica. La compra y todos sus detalles se crean en una sola transacción.',
  })
  @ApiBody({
    type: CreatePurchaseDto,
    description: 'Datos de la compra y sus detalles',
    examples: {
      invoice: {
        summary: 'Compra con factura',
        value: {
          storeId: '123e4567-e89b-12d3-a456-426614174000',
          supplierId: '123e4567-e89b-12d3-a456-426614174001',
          userId: '123e4567-e89b-12d3-a456-426614174002',
          documentNumber: 'F001-00000001',
          documentType: 'INVOICE',
          purchaseDate: '2025-01-20T10:30:00.000Z',
          subtotal: 250.00,
          tax: 45.00,
          discount: 10.00,
          notes: 'Compra urgente para reposición de stock',
          details: [
            {
              productId: '123e4567-e89b-12d3-a456-426614174003',
              quantity: 10,
              unitPrice: 25.00,
              discount: 0
            },
            {
              productId: '123e4567-e89b-12d3-a456-426614174004',
              quantity: 5,
              unitPrice: 15.00,
              discount: 2.50
            }
          ]
        }
      },
      receipt: {
        summary: 'Compra con recibo',
        value: {
          storeId: '123e4567-e89b-12d3-a456-426614174000',
          supplierId: '123e4567-e89b-12d3-a456-426614174001',
          userId: '123e4567-e89b-12d3-a456-426614174002',
          documentNumber: 'R001-00000001',
          documentType: 'RECEIPT',
          purchaseDate: '2025-01-20T10:30:00.000Z',
          subtotal: 100.00,
          tax: 18.00,
          discount: 0,
          notes: 'Compra menor',
          details: [
            {
              productId: '123e4567-e89b-12d3-a456-426614174005',
              quantity: 2,
              unitPrice: 50.00,
              discount: 0
            }
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Compra creada exitosamente',
    type: PurchaseResponseDto,
    examples: {
      success: {
        summary: 'Compra creada exitosamente',
        value: {
          id: '123e4567-e89b-12d3-a456-426614174006',
          storeId: '123e4567-e89b-12d3-a456-426614174000',
          supplierId: '123e4567-e89b-12d3-a456-426614174001',
          userId: '123e4567-e89b-12d3-a456-426614174002',
          documentNumber: 'F001-00000001',
          documentType: 'INVOICE',
          purchaseDate: '2025-01-20T10:30:00.000Z',
          subtotal: 250.00,
          tax: 45.00,
          discount: 10.00,
          total: 285.00,
          status: 'REGISTERED',
          notes: 'Compra urgente para reposición de stock',
          registeredAt: '2025-01-20T10:30:00.000Z',
          updatedAt: '2025-01-20T10:30:00.000Z',
          details: [
            {
              id: '123e4567-e89b-12d3-a456-426614174007',
              productId: '123e4567-e89b-12d3-a456-426614174003',
              quantity: 10,
              unitPrice: 25.00,
              discount: 0,
              subtotal: 250.00,
              totalWithDiscount: 250.00,
              discountPercentage: 0
            }
          ],
          totalQuantity: 15,
          totalDiscount: 2.50
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: 'Datos de entrada inválidos',
        error: 'Bad Request',
        details: [
          'El subtotal debe ser mayor a 0',
          'La cantidad debe ser mayor a 0',
          'El precio unitario debe ser mayor a 0'
        ]
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Recurso no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Tienda con ID 123e4567-e89b-12d3-a456-426614174000 no encontrada',
        error: 'Not Found'
      }
    }
  })
  @ApiConflictResponse({
    description: 'Conflicto - Ya existe una compra con el mismo número de documento',
    schema: {
      example: {
        statusCode: 409,
        message: 'Ya existe una compra con número de documento F001-00000001 en la tienda 123e4567-e89b-12d3-a456-426614174000',
        error: 'Conflict'
      }
    }
  })
  async create(@Body() createPurchaseDto: CreatePurchaseDto): Promise<PurchaseResponseDto> {
    try {
      return await this.purchaseService.create(createPurchaseDto);
    } catch (error) {
      // El filtro global se encargará del manejo de errores
      // pero aquí podemos agregar logs específicos si es necesario
      throw error;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Listar compras',
    description: 'Obtiene una lista paginada de compras con filtros opcionales',
  })
  @ApiQuery({
    name: 'storeId',
    required: false,
    description: 'Filtrar por ID de tienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiQuery({
    name: 'supplierId',
    required: false,
    description: 'Filtrar por ID de proveedor',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid'
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filtrar por ID de usuario',
    example: '123e4567-e89b-12d3-a456-426614174002',
    format: 'uuid'
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por estado de compra',
    enum: ['PENDING', 'REGISTERED', 'CANCELLED', 'RECEIVED'],
    example: 'REGISTERED'
  })
  @ApiQuery({
    name: 'documentType',
    required: false,
    description: 'Filtrar por tipo de documento',
    enum: ['INVOICE', 'RECEIPT', 'NOTE', 'ORDER'],
    example: 'INVOICE'
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Fecha de inicio para filtrar compras',
    example: '2025-01-01T00:00:00.000Z',
    format: 'date-time'
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Fecha de fin para filtrar compras',
    example: '2025-01-31T23:59:59.999Z',
    format: 'date-time'
  })
  @ApiQuery({
    name: 'documentNumber',
    required: false,
    description: 'Filtrar por número de documento',
    example: 'F001-00000001',
    maxLength: 50
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página para paginación',
    example: 1,
    minimum: 1,
    maximum: 1000
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Límite de resultados por página',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Campo para ordenar los resultados',
    example: 'purchaseDate',
    enum: ['purchaseDate', 'total', 'status', 'registeredAt']
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
    description: 'Lista de compras obtenida exitosamente',
    type: ListPurchasesResponseDto,
    examples: {
      success: {
        summary: 'Lista de compras con paginación',
        value: {
          data: [
            {
              id: '123e4567-e89b-12d3-a456-426614174006',
              storeId: '123e4567-e89b-12d3-a456-426614174000',
              supplierId: '123e4567-e89b-12d3-a456-426614174001',
              userId: '123e4567-e89b-12d3-a456-426614174002',
              documentNumber: 'F001-00000001',
              documentType: 'INVOICE',
              purchaseDate: '2025-01-20T10:30:00.000Z',
              subtotal: 250.00,
              tax: 45.00,
              discount: 10.00,
              total: 285.00,
              status: 'REGISTERED',
              notes: 'Compra urgente para reposición de stock',
              registeredAt: '2025-01-20T10:30:00.000Z',
              updatedAt: '2025-01-20T10:30:00.000Z',
              details: [],
              totalQuantity: 15,
              totalDiscount: 2.50
            }
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 25,
            totalPages: 3
          }
        }
      }
    }
  })
  async listPurchases(@Query() query: PurchaseQueryDto): Promise<ListPurchasesResult> {
    return this.purchaseService.listPurchases(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener compra por ID',
    description: 'Obtiene una compra específica con todos sus detalles',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la compra',
    example: '123e4567-e89b-12d3-a456-426614174006',
    format: 'uuid'
  })
  @ApiResponse({
    status: 200,
    description: 'Compra obtenida exitosamente',
    type: PurchaseResponseDto,
    examples: {
      success: {
        summary: 'Compra con detalles',
        value: {
          id: '123e4567-e89b-12d3-a456-426614174006',
          storeId: '123e4567-e89b-12d3-a456-426614174000',
          supplierId: '123e4567-e89b-12d3-a456-426614174001',
          userId: '123e4567-e89b-12d3-a456-426614174002',
          documentNumber: 'F001-00000001',
          documentType: 'INVOICE',
          purchaseDate: '2025-01-20T10:30:00.000Z',
          subtotal: 250.00,
          tax: 45.00,
          discount: 10.00,
          total: 285.00,
          status: 'REGISTERED',
          notes: 'Compra urgente para reposición de stock',
          registeredAt: '2025-01-20T10:30:00.000Z',
          updatedAt: '2025-01-20T10:30:00.000Z',
          details: [
            {
              id: '123e4567-e89b-12d3-a456-426614174007',
              productId: '123e4567-e89b-12d3-a456-426614174003',
              quantity: 10,
              unitPrice: 25.00,
              discount: 0,
              subtotal: 250.00,
              totalWithDiscount: 250.00,
              discountPercentage: 0
            }
          ],
          totalQuantity: 15,
          totalDiscount: 2.50
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Compra no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Compra con ID 123e4567-e89b-12d3-a456-426614174006 no encontrada',
        error: 'Not Found'
      }
    }
  })
  async findById(@Param('id') id: string): Promise<PurchaseResponseDto> {
    return this.purchaseService.findById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar compra completa',
    description: 'Actualiza todos los campos de una compra existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la compra',
    example: '123e4567-e89b-12d3-a456-426614174006',
    format: 'uuid'
  })
  @ApiBody({
    type: UpdatePurchaseDto,
    description: 'Datos actualizados de la compra',
    examples: {
      update: {
        summary: 'Actualización de compra',
        value: {
          documentNumber: 'F001-00000002',
          documentType: 'INVOICE',
          purchaseDate: '2025-01-21T10:30:00.000Z',
          subtotal: 300.00,
          tax: 54.00,
          discount: 15.00,
          status: 'REGISTERED',
          notes: 'Compra actualizada con nuevos productos',
          details: [
            {
              id: '123e4567-e89b-12d3-a456-426614174007',
              productId: '123e4567-e89b-12d3-a456-426614174003',
              quantity: 12,
              unitPrice: 25.00,
              discount: 0
            }
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Compra actualizada exitosamente',
    type: PurchaseResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Compra no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Compra con ID 123e4567-e89b-12d3-a456-426614174006 no encontrada',
        error: 'Not Found'
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'No se puede actualizar la compra en su estado actual',
    schema: {
      example: {
        statusCode: 400,
        message: 'No se puede realizar la operación. La compra con ID 123e4567-e89b-12d3-a456-426614174006 está cancelada',
        error: 'Bad Request'
      }
    }
  })
  async update(@Param('id') id: string, @Body() updatePurchaseDto: UpdatePurchaseDto): Promise<PurchaseResponseDto> {
    return this.purchaseService.update(id, updatePurchaseDto);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancelar compra',
    description: 'Cancela una compra existente. Solo se pueden cancelar compras en estado PENDING o REGISTERED',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la compra',
    example: '123e4567-e89b-12d3-a456-426614174006',
    format: 'uuid'
  })
  @ApiResponse({
    status: 200,
    description: 'Compra cancelada exitosamente',
    type: PurchaseResponseDto,
    examples: {
      success: {
        summary: 'Compra cancelada',
        value: {
          id: '123e4567-e89b-12d3-a456-426614174006',
          storeId: '123e4567-e89b-12d3-a456-426614174000',
          supplierId: '123e4567-e89b-12d3-a456-426614174001',
          userId: '123e4567-e89b-12d3-a456-426614174002',
          documentNumber: 'F001-00000001',
          documentType: 'INVOICE',
          purchaseDate: '2025-01-20T10:30:00.000Z',
          subtotal: 250.00,
          tax: 45.00,
          discount: 10.00,
          total: 285.00,
          status: 'CANCELLED',
          notes: 'Compra urgente para reposición de stock',
          registeredAt: '2025-01-20T10:30:00.000Z',
          updatedAt: '2025-01-20T10:30:00.000Z',
          details: [],
          totalQuantity: 15,
          totalDiscount: 2.50
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Compra no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Compra con ID 123e4567-e89b-12d3-a456-426614174006 no encontrada',
        error: 'Not Found'
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'No se puede cancelar la compra en su estado actual',
    schema: {
      example: {
        statusCode: 400,
        message: 'No se puede realizar la operación. La compra con ID 123e4567-e89b-12d3-a456-426614174006 está cancelada',
        error: 'Bad Request'
      }
    }
  })
  async cancel(@Param('id') id: string): Promise<PurchaseResponseDto> {
    return this.purchaseService.cancel(id);
  }

  @Patch(':id/receive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Marcar compra como recibida',
    description: 'Marca una compra como recibida. Solo se pueden marcar como recibidas compras en estado REGISTERED',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la compra',
    example: '123e4567-e89b-12d3-a456-426614174006',
    format: 'uuid'
  })
  @ApiResponse({
    status: 200,
    description: 'Compra marcada como recibida exitosamente',
    type: PurchaseResponseDto,
    examples: {
      success: {
        summary: 'Compra recibida',
        value: {
          id: '123e4567-e89b-12d3-a456-426614174006',
          storeId: '123e4567-e89b-12d3-a456-426614174000',
          supplierId: '123e4567-e89b-12d3-a456-426614174001',
          userId: '123e4567-e89b-12d3-a456-426614174002',
          documentNumber: 'F001-00000001',
          documentType: 'INVOICE',
          purchaseDate: '2025-01-20T10:30:00.000Z',
          subtotal: 250.00,
          tax: 45.00,
          discount: 10.00,
          total: 285.00,
          status: 'RECEIVED',
          notes: 'Compra urgente para reposición de stock',
          registeredAt: '2025-01-20T10:30:00.000Z',
          updatedAt: '2025-01-20T10:30:00.000Z',
          details: [],
          totalQuantity: 15,
          totalDiscount: 2.50
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Compra no encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Compra con ID 123e4567-e89b-12d3-a456-426614174006 no encontrada',
        error: 'Not Found'
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'No se puede marcar como recibida la compra en su estado actual',
    schema: {
      example: {
        statusCode: 400,
        message: 'No se puede realizar la operación. La compra con ID 123e4567-e89b-12d3-a456-426614174006 ya fue recibida',
        error: 'Bad Request'
      }
    }
  })
  async markAsReceived(@Param('id') id: string): Promise<PurchaseResponseDto> {
    return this.purchaseService.markAsReceived(id);
  }
}
