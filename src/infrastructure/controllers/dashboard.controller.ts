import { Controller, Get, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from '../../application/services/dashboard.service';
import { SellerStatsResponseDto, AdminStatsResponseDto, SuperadminStatsResponseDto } from '../../application/dto/dashboard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { StoreScopeGuard } from '../guards/store-scope.guard';
import { StoreScoped } from '../decorators/store-scoped.decorator';
import { UserRole } from '../../domain/enums/user-role.enum';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, StoreScopeGuard)
@ApiBearerAuth('JWT')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @StoreScoped()
  @ApiOperation({ 
    summary: 'Obtener estadísticas del dashboard según rol',
    description: `
      Retorna estadísticas específicas según el rol:
      
      **SELLER:**
      - Productos disponibles (cantidad)
      - Clientes activos (cantidad)
      - Ventas del mes (cantidad)
      
      **ADMIN:**
      - Productos disponibles (cantidad)
      - Clientes activos (cantidad)
      - Ventas del mes (cantidad)
      - Ingresos del mes (soles)
      
      **SUPERADMIN:**
      - Total usuarios
      - Tiendas activas
      - Ingresos totales
      - Transacciones del mes
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'No tiene permisos',
  })
  async getStats(@Request() req: any): Promise<SellerStatsResponseDto | AdminStatsResponseDto | SuperadminStatsResponseDto> {
    const user = req.user;
    const storeFilter = req.storeFilter;

    switch (user.role) {
      case UserRole.SELLER:
        if (!storeFilter?.storeId) {
          throw new ForbiddenException('El vendedor debe tener una tienda asignada');
        }
        return this.dashboardService.getSellerStats(storeFilter.storeId);

      case UserRole.ADMIN:
        if (!storeFilter?.storeId) {
          throw new ForbiddenException('El administrador debe tener una tienda asignada');
        }
        return this.dashboardService.getAdminStats(storeFilter.storeId);

      case UserRole.SUPERADMIN:
        return this.dashboardService.getSuperadminStats();

      default:
        throw new ForbiddenException('Rol no reconocido');
    }
  }
}

