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
import { PersonService } from '../../application/services/person.service';
import {
  CreatePersonDto,
  UpdatePersonDto,
  PersonResponseDto,
  PersonQueryDto,
  ChangePersonStatusDto,
} from '../../application/dto/person';
import { ListPersonsResult } from '../../application/use-cases/person';

@ApiTags('persons')
@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva persona' })
  @ApiResponse({ status: 201, description: 'Persona creada exitosamente', type: PersonResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async createPerson(@Body() createPersonDto: CreatePersonDto): Promise<PersonResponseDto> {
    return this.personService.createPerson(createPersonDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener persona por ID' })
  @ApiParam({ name: 'id', description: 'ID único de la persona', type: 'string' })
  @ApiResponse({ status: 200, description: 'Persona encontrada', type: PersonResponseDto })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  async getPersonById(@Param('id') id: string): Promise<PersonResponseDto | null> {
    return this.personService.getPersonById(id);
  }

  @Get('document/:documentNumber')
  @ApiOperation({ summary: 'Obtener persona por número de documento' })
  @ApiParam({ name: 'documentNumber', description: 'Número de documento de la persona', type: 'string' })
  @ApiResponse({ status: 200, description: 'Persona encontrada', type: PersonResponseDto })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  async getPersonByDocument(
    @Param('documentNumber') documentNumber: string,
  ): Promise<PersonResponseDto | null> {
    return this.personService.getPersonByDocument(documentNumber);
  }

  @Get()
  @ApiOperation({ summary: 'Listar personas con filtros y paginación' })
  @ApiQuery({ name: 'documentType', required: false, description: 'Filtrar por tipo de documento' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por estado' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nombre o documento' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', type: 'number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página', type: 'number' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo de ordenamiento' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Orden (asc/desc)' })
  @ApiResponse({ status: 200, description: 'Lista de personas obtenida exitosamente' })
  async listPersons(@Query() query: PersonQueryDto): Promise<ListPersonsResult> {
    return this.personService.listPersons(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de una persona (actualización parcial)' })
  @ApiParam({ name: 'id', description: 'ID único de la persona', type: 'string' })
  @ApiResponse({ status: 200, description: 'Persona actualizada exitosamente', type: PersonResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  async updatePerson(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<PersonResponseDto> {
    return this.personService.updatePerson(id, updatePersonDto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Cambiar estado de una persona' })
  @ApiParam({ name: 'id', description: 'ID único de la persona', type: 'string' })
  @ApiResponse({ status: 200, description: 'Estado de persona cambiado exitosamente', type: PersonResponseDto })
  @ApiResponse({ status: 400, description: 'Estado inválido' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  async changePersonStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangePersonStatusDto,
  ): Promise<PersonResponseDto> {
    return this.personService.changePersonStatus(id, changeStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una persona (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID único de la persona', type: 'string' })
  @ApiResponse({ status: 204, description: 'Persona eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Persona no encontrada' })
  async deletePerson(@Param('id') id: string): Promise<PersonResponseDto> {
    return this.personService.deletePerson(id);
  }
}
