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
import { SaleService } from '../../application/services/sale.service';
import { 
  CreateSaleDto, 
  UpdateSaleDto, 
  SaleQueryDto, 
  SaleResponseDto,
  ListSalesResponseDto,
  RefundSaleDto
} from '../../application/dto/sale';
import { ListSalesResult } from '../../application/use-cases/sale';
import type { StoreFilter } from '../../domain/value-objects';
import { StoreScoped } from '../decorators';

@ApiTags('Sales')
@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nueva venta',
    description: 'Crea una nueva venta con sus detalles de forma atómica. La venta y todos sus detalles se crean en una sola transacción, y el stock se decrementa automáticamente.',
  })
  @ApiBody({
    type: CreateSaleDto,
    description: 'Datos de la venta y sus detalles',
    examples: {
      receipt: {
        summary: 'Venta con boleta',
        value: {
          storeId: '123e4567-e89b-12d3-a456-426614174000',
          customerId: '123e4567-e89b-12d3-a456-426614174001',
          userId: '123e4567-e89b-12d3-a456-426614174002',
          documentType: 'RECEIPT',
          series: 'B001',
          saleDate: '2025-01-20T10:30:00.000Z',
          discount: 10.00,
          notes: 'Venta al contado',
          details: [
            {
              productId: '123e4567-e89b-12d3-a456-426614174003',
              quantity: 2,
              unitPrice: 50.00,
              discount: 0
            },
            {
              productId: '123e4567-e89b-12d3-a456-426614174004',
              quantity: 1,
              unitPrice: 30.00,
              discount: 5.00
            }
          ]
        }
      },
      invoice: {
        summary: 'Venta con factura',
        value: {
          storeId: '123e4567-e89b-12d3-a456-426614174000',
          customerId: '123e4567-e89b-12d3-a456-426614174001',
          userId: '123e4567-e89b-12d3-a456-426614174002',
          documentNumber: 'F001-00000001',
          documentType: 'INVOICE',
          series: 'F001',
          saleDate: '2025-01-20T10:30:00.000Z',
          discount: 0,
          notes: 'Venta con factura',
          details: [
            {
              productId: '123e4567-e89b-12d3-a456-426614174005',
              quantity: 5,
              unitPrice: 25.00,
              discount: 0
            }
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Venta creada exitosamente',
    type: SaleResponseDto,
    examples: {
      success: {
        summary: 'Venta creada exitosamente',
        value: {
          id: '123e4567-e89b-12d3-a456-426614174006',
          storeId: '123e4567-e89b-12d3-a456-426614174000',
          customerId: '123e4567-e89b-12d3-a456-426614174001',
          userId: '123e4567-e89b-12d3-a456-426614174002',
          documentNumber: 'B001-00000001',
          documentType: 'RECEIPT',
          series: 'B001',
          saleDate: '2025-01-20T10:30:00.000Z',
          subtotal: 130.00,
          tax: 23.40,
          discount: 10.00,
          total: 143.40,
          status: 'PENDING',
          notes: 'Venta al contado',
          registeredAt: '2025-01-20T10:30:00.000Z',
          updatedAt: '2025-01-20T10:30:00.000Z',
          details: [
            {
              id: '123e4567-e89b-12d3-a456-426614174007',
              productId: '123e4567-e89b-12d3-a456-426614174003',
              quantity: 2,
              unitPrice: 50.00,
              discount: 0,
              subtotal: 100.00,
              totalWithDiscount: 100.00,
              discountPercentage: 0
            }
          ],
          totalQuantity: 3,
          totalDiscount: 5.00
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
    examples: {
      validation: {
        summary: 'Error de validación',
        value: {
          statusCode: 400,
          message: [
            'storeId must be a UUID',
            'customerId must be a UUID',
            'details must contain at least 1 element'
          ],
          error: 'Bad Request'
        }
      },
      insufficientStock: {
        summary: 'Stock insuficiente',
        value: {
          statusCode: 400,
          message: 'Stock insuficiente. Solicitado: 10, Disponible: 5',
          error: 'Bad Request'
        }
      }
    }
  })
  @ApiConflictResponse({
    description: 'Conflicto con datos existentes',
    examples: {
      duplicateDocument: {
        summary: 'Número de documento duplicado',
        value: {
          statusCode: 409,
          message: 'Ya existe una venta con número de documento B001-00000001 en la tienda 123e4567-e89b-12d3-a456-426614174000',
          error: 'Conflict'
        }
      }
    }
  })
  async createSale(@Body() createSaleDto: CreateSaleDto): Promise<SaleResponseDto> {
    return this.saleService.createSale(createSaleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar ventas',
    description: 'Obtiene una lista paginada de ventas con filtros opcionales.',
  })
  @ApiQuery({
    name: 'storeId',
    required: false,
    description: 'Filtrar por ID de tienda',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'Filtrar por ID de cliente',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por estado de venta',
    enum: ['PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED'],
    example: 'COMPLETED'
  })
  @ApiQuery({
    name: 'documentType',
    required: false,
    description: 'Filtrar por tipo de comprobante',
    enum: ['RECEIPT', 'INVOICE', 'SALE_NOTE', 'PROFORMA'],
    example: 'RECEIPT'
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Fecha de inicio del rango',
    example: '2025-01-01T00:00:00.000Z'
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Fecha de fin del rango',
    example: '2025-01-31T23:59:59.999Z'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
    type: Number
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Cantidad de elementos por página',
    example: 10,
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ventas obtenida exitosamente',
    type: ListSalesResponseDto
  })
  @StoreScoped()
  async listSales(
    @Query() query: SaleQueryDto,
    @Req() request: Request
  ): Promise<ListSalesResult> {
    const storeFilter = request['storeFilter'] as StoreFilter;
    return this.saleService.listSales(query, storeFilter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener venta por ID',
    description: 'Obtiene una venta específica por su ID único.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la venta',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiResponse({
    status: 200,
    description: 'Venta encontrada exitosamente',
    type: SaleResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Venta no encontrada',
    examples: {
      notFound: {
        summary: 'Venta no encontrada',
        value: {
          statusCode: 404,
          message: 'Venta con ID 123e4567-e89b-12d3-a456-426614174000 no encontrada',
          error: 'Not Found'
        }
      }
    }
  })
  @StoreScoped()
  async getSaleById(
    @Param('id') id: string,
    @Req() request: Request
  ): Promise<SaleResponseDto> {
    const storeFilter = request['storeFilter'] as StoreFilter;
    return this.saleService.getSaleById(id, storeFilter);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar venta',
    description: 'Actualiza una venta existente. Solo se pueden actualizar ventas en estado PENDING.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la venta',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiBody({
    type: UpdateSaleDto,
    description: 'Datos a actualizar de la venta',
    examples: {
      updateNotes: {
        summary: 'Actualizar notas',
        value: {
          notes: 'Venta con descuento especial aplicado'
        }
      },
      updateDiscount: {
        summary: 'Actualizar descuento',
        value: {
          discount: 15.00,
          notes: 'Descuento por cliente frecuente'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Venta actualizada exitosamente',
    type: SaleResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Venta no encontrada'
  })
  @ApiBadRequestResponse({
    description: 'Venta no se puede actualizar en su estado actual',
    examples: {
      notPending: {
        summary: 'Venta no pendiente',
        value: {
          statusCode: 400,
          message: 'Solo se pueden actualizar ventas pendientes. La venta 123e4567-e89b-12d3-a456-426614174000 no está en estado pendiente',
          error: 'Bad Request'
        }
      }
    }
  })
  async updateSale(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto
  ): Promise<SaleResponseDto> {
    return this.saleService.updateSale(id, updateSaleDto);
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Completar venta',
    description: 'Marca una venta como completada. Solo se pueden completar ventas en estado PENDING.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la venta',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiResponse({
    status: 200,
    description: 'Venta completada exitosamente',
    type: SaleResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Venta no encontrada'
  })
  @ApiBadRequestResponse({
    description: 'Venta no se puede completar en su estado actual',
    examples: {
      alreadyCompleted: {
        summary: 'Venta ya completada',
        value: {
          statusCode: 400,
          message: 'La venta 123e4567-e89b-12d3-a456-426614174000 ya está completada',
          error: 'Bad Request'
        }
      }
    }
  })
  async completeSale(@Param('id') id: string): Promise<SaleResponseDto> {
    return this.saleService.completeSale(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancelar venta',
    description: 'Cancela una venta y restaura el stock de productos. Solo se pueden cancelar ventas en estado PENDING o COMPLETED.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la venta',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiResponse({
    status: 200,
    description: 'Venta cancelada exitosamente',
    type: SaleResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Venta no encontrada'
  })
  @ApiBadRequestResponse({
    description: 'Venta no se puede cancelar en su estado actual',
    examples: {
      alreadyCancelled: {
        summary: 'Venta ya cancelada',
        value: {
          statusCode: 400,
          message: 'La venta 123e4567-e89b-12d3-a456-426614174000 ya está cancelada',
          error: 'Bad Request'
        }
      }
    }
  })
  async cancelSale(@Param('id') id: string): Promise<SaleResponseDto> {
    return this.saleService.cancelSale(id);
  }

  @Post(':id/refund')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Procesar devolución',
    description: 'Procesa una devolución parcial o total de una venta. Solo se pueden procesar devoluciones de ventas completadas.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la venta',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiBody({
    type: RefundSaleDto,
    description: 'Detalles de la devolución',
    examples: {
      partialRefund: {
        summary: 'Devolución parcial',
        value: {
          details: [
            {
              productId: '123e4567-e89b-12d3-a456-426614174003',
              quantity: 1
            }
          ],
          reason: 'Producto defectuoso'
        }
      },
      fullRefund: {
        summary: 'Devolución total',
        value: {
          details: [
            {
              productId: '123e4567-e89b-12d3-a456-426614174003',
              quantity: 2
            },
            {
              productId: '123e4567-e89b-12d3-a456-426614174004',
              quantity: 1
            }
          ],
          reason: 'Cliente no satisfecho'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Devolución procesada exitosamente',
    type: SaleResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Venta no encontrada'
  })
  @ApiBadRequestResponse({
    description: 'No se puede procesar devolución en el estado actual de la venta',
    examples: {
      notCompleted: {
        summary: 'Venta no completada',
        value: {
          statusCode: 400,
          message: 'No se puede procesar devolución de la venta 123e4567-e89b-12d3-a456-426614174000 en su estado actual',
          error: 'Bad Request'
        }
      }
    }
  })
  async refundSale(
    @Param('id') id: string,
    @Body() refundSaleDto: RefundSaleDto
  ): Promise<SaleResponseDto> {
    return this.saleService.refundSale(id, refundSaleDto);
  }
}
