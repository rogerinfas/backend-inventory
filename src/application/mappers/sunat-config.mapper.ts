import { SunatConfig } from '../../domain/entities/sunat-config.entity';
import { SunatEnvironment } from '../../domain/enums/sunat-environment.enum';
import { SunatConfigQueryFilters } from '../../domain/repositories/sunat-config.repository';
import {
  CreateSunatConfigDto,
  UpdateSunatConfigDto,
  SunatConfigResponseDto,
  SunatConfigQueryDto,
} from '../dto/sunat-config';

export class SunatConfigMapper {
  // DTO → Entidad
  static toDomain(dto: CreateSunatConfigDto, id: string): SunatConfig {
    return SunatConfig.create(
      id,
      dto.storeId,
      dto.solUsername,
      dto.solPassword,
      undefined, // digitalCertificate se maneja por separado
      dto.certificatePassword,
      dto.apiUrl,
      dto.environment || SunatEnvironment.TEST
    );
  }

  // Entidad → DTO de respuesta
  static toResponseDto(sunatConfig: SunatConfig): SunatConfigResponseDto {
    return {
      id: sunatConfig.id,
      storeId: sunatConfig.storeId,
      solUsername: sunatConfig.solUsername,
      // solPassword: NO se incluye por seguridad
      certificatePassword: sunatConfig.certificatePassword || undefined,
      apiUrl: sunatConfig.apiUrl || undefined,
      environment: sunatConfig.environment,
      createdAt: sunatConfig.createdAt,
      updatedAt: sunatConfig.updatedAt,
    };
  }

  // Aplicar actualizaciones a entidad existente
  static toUpdateDomain(dto: UpdateSunatConfigDto, existingSunatConfig: SunatConfig): SunatConfig {
    if (!this.validateUpdateDto(dto)) {
      throw new Error('No hay campos válidos para actualizar');
    }

    if (dto.solUsername !== undefined || dto.solPassword !== undefined) {
      existingSunatConfig.updateSolCredentials(
        dto.solUsername || existingSunatConfig.solUsername,
        dto.solPassword || existingSunatConfig.solPassword
      );
    }

    if (dto.certificatePassword !== undefined) {
      existingSunatConfig.updateDigitalCertificate(
        existingSunatConfig.digitalCertificate,
        dto.certificatePassword
      );
    }

    if (dto.apiUrl !== undefined) {
      existingSunatConfig.updateApiUrl(dto.apiUrl);
    }

    if (dto.environment !== undefined) {
      existingSunatConfig.changeEnvironment(dto.environment);
    }

    return existingSunatConfig;
  }

  // Query DTO → Filtros de repositorio
  static toQueryFilters(query: SunatConfigQueryDto): SunatConfigQueryFilters {
    return {
      storeId: query.storeId,
      environment: query.environment,
    };
  }

  // Validar DTO de actualización
  static validateUpdateDto(dto: UpdateSunatConfigDto): boolean {
    const fields = Object.keys(dto) as (keyof UpdateSunatConfigDto)[];
    return fields.some(field => {
      const value = dto[field];
      return value !== undefined && value !== null && value !== '';
    });
  }
}
