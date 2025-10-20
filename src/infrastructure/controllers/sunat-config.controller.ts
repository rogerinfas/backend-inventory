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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse
} from '@nestjs/swagger';
import { SunatConfigService } from '../../application/services/sunat-config.service';
import {
  CreateSunatConfigDto,
  UpdateSunatConfigDto,
  SunatConfigResponseDto,
  SunatConfigQueryDto,
  ListSunatConfigsResponseDto,
} from '../../application/dto/sunat-config';
import { ListSunatConfigsResult } from '../../application/use-cases/sunat-config';

@ApiTags('sunat-config')
@Controller('sunat-config')
export class SunatConfigController {
  constructor(private readonly sunatConfigService: SunatConfigService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear una nueva configuración SUNAT',
    description: 'Crea una nueva configuración SUNAT para una tienda específica. Solo puede existir una configuración por tienda.'
  })
  @ApiBody({ 
    type: CreateSunatConfigDto,
    description: 'Datos de la configuración SUNAT a crear',
    examples: {
      'configuracion-basica': {
        summary: 'Configuración básica',
        description: 'Ejemplo de configuración básica con ambiente de pruebas',
        value: {
          storeId: '123e4567-e89b-12d3-a456-426614174001',
          solUsername: 'usuario_sol_123',
          solPassword: 'mi_password_seguro_123',
          environment: 'TEST'
        }
      },
      'configuracion-completa': {
        summary: 'Configuración completa',
        description: 'Ejemplo de configuración completa con todos los campos',
        value: {
          storeId: '123e4567-e89b-12d3-a456-426614174001',
          solUsername: 'usuario_sol_123',
          solPassword: 'mi_password_seguro_123',
          certificatePassword: 'cert_password_123',
          apiUrl: 'https://api.sunat.gob.pe/v1',
          environment: 'PRODUCTION'
        }
      }
    }
  })
  @ApiCreatedResponse({ 
    description: 'Configuración SUNAT creada exitosamente', 
    type: SunatConfigResponseDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o credenciales SOL faltantes' 
  })
  @ApiNotFoundResponse({ 
    description: 'Tienda no encontrada' 
  })
  @ApiConflictResponse({ 
    description: 'Ya existe una configuración SUNAT para esta tienda' 
  })
  async createSunatConfig(@Body() createSunatConfigDto: CreateSunatConfigDto): Promise<SunatConfigResponseDto> {
    return this.sunatConfigService.createSunatConfig(createSunatConfigDto);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener configuración SUNAT por ID',
    description: 'Obtiene los detalles de una configuración SUNAT específica usando su ID único.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único de la configuración SUNAT', 
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiOkResponse({ 
    description: 'Configuración SUNAT encontrada', 
    type: SunatConfigResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Configuración SUNAT no encontrada' 
  })
  async getSunatConfigById(@Param('id') id: string): Promise<SunatConfigResponseDto | null> {
    return this.sunatConfigService.getSunatConfigById(id);
  }

  @Get('store/:storeId')
  @ApiOperation({ 
    summary: 'Obtener configuración SUNAT por ID de tienda',
    description: 'Obtiene la configuración SUNAT asociada a una tienda específica.'
  })
  @ApiParam({ 
    name: 'storeId', 
    description: 'ID único de la tienda', 
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid'
  })
  @ApiOkResponse({ 
    description: 'Configuración SUNAT encontrada', 
    type: SunatConfigResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Configuración SUNAT no encontrada para esta tienda' 
  })
  async getSunatConfigByStoreId(@Param('storeId') storeId: string): Promise<SunatConfigResponseDto | null> {
    return this.sunatConfigService.getSunatConfigByStoreId(storeId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar configuraciones SUNAT',
    description: 'Obtiene una lista paginada de configuraciones SUNAT con filtros opcionales.'
  })
  @ApiQuery({ 
    name: 'storeId', 
    required: false, 
    description: 'Filtrar por ID de tienda específica',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid'
  })
  @ApiQuery({ 
    name: 'environment', 
    required: false, 
    description: 'Filtrar por ambiente de SUNAT',
    enum: ['TEST', 'PRODUCTION'],
    example: 'TEST'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Número de página (empezando desde 1)',
    type: 'number',
    example: 1,
    minimum: 1,
    maximum: 1000
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Elementos por página',
    type: 'number',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  @ApiQuery({ 
    name: 'sortBy', 
    required: false, 
    description: 'Campo de ordenamiento',
    enum: ['createdAt', 'updatedAt', 'solUsername'],
    example: 'createdAt'
  })
  @ApiQuery({ 
    name: 'sortOrder', 
    required: false, 
    description: 'Orden de clasificación',
    enum: ['asc', 'desc'],
    example: 'desc'
  })
  @ApiOkResponse({ 
    description: 'Lista de configuraciones SUNAT obtenida exitosamente',
    type: ListSunatConfigsResponseDto
  })
  async listSunatConfigs(@Query() query: SunatConfigQueryDto): Promise<ListSunatConfigsResult> {
    return this.sunatConfigService.listSunatConfigs(query);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar configuración SUNAT',
    description: 'Actualiza parcialmente una configuración SUNAT existente. Solo se actualizarán los campos proporcionados.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único de la configuración SUNAT', 
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiBody({ 
    type: UpdateSunatConfigDto,
    description: 'Campos a actualizar en la configuración SUNAT',
    examples: {
      'actualizar-credenciales': {
        summary: 'Actualizar credenciales SOL',
        description: 'Ejemplo de actualización de credenciales SOL',
        value: {
          solUsername: 'nuevo_usuario_sol',
          solPassword: 'nueva_password_segura'
        }
      },
      'cambiar-ambiente': {
        summary: 'Cambiar ambiente',
        description: 'Ejemplo de cambio de ambiente a producción',
        value: {
          environment: 'PRODUCTION'
        }
      }
    }
  })
  @ApiOkResponse({ 
    description: 'Configuración SUNAT actualizada exitosamente', 
    type: SunatConfigResponseDto 
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos' 
  })
  @ApiNotFoundResponse({ 
    description: 'Configuración SUNAT no encontrada' 
  })
  async updateSunatConfig(
    @Param('id') id: string,
    @Body() updateSunatConfigDto: UpdateSunatConfigDto,
  ): Promise<SunatConfigResponseDto> {
    return this.sunatConfigService.updateSunatConfig(id, updateSunatConfigDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar configuración SUNAT',
    description: 'Elimina permanentemente una configuración SUNAT. Esta acción no se puede deshacer. La respuesta será vacía (HTTP 204 No Content) si la eliminación es exitosa.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único de la configuración SUNAT', 
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @ApiNoContentResponse({ 
    description: 'Configuración SUNAT eliminada exitosamente. Respuesta vacía (sin body).',
    content: {}
  })
  @ApiNotFoundResponse({ 
    description: 'Configuración SUNAT no encontrada' 
  })
  async deleteSunatConfig(@Param('id') id: string): Promise<void> {
    return this.sunatConfigService.deleteSunatConfig(id);
  }
}
