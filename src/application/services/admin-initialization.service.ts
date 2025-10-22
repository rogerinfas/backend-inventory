import { Injectable, Logger, Inject } from '@nestjs/common';
import { CreateGeneralAdminUseCase } from '../use-cases/create-general-admin.use-case';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserRole } from '../../domain/enums/user-role.enum';

@Injectable()
export class AdminInitializationService {
  private readonly logger = new Logger(AdminInitializationService.name);

  constructor(
    private readonly createGeneralAdminUseCase: CreateGeneralAdminUseCase,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Inicializa el administrador general del sistema
   * Se ejecuta al arrancar la aplicación
   */
  async initializeGeneralAdmin(): Promise<void> {
    try {
      this.logger.log('Iniciando verificación de administrador general...');

      // Verificar si ya existe un admin general
      const existingAdmins = await this.userRepository.findByRole(UserRole.ADMIN);
      const hasGeneralAdmin = existingAdmins.some(admin => admin.storeId === null);

      if (hasGeneralAdmin) {
        this.logger.log('Administrador general ya existe, saltando inicialización');
        return;
      }

      // Crear el administrador general por defecto
      const result = await this.createGeneralAdminUseCase.execute({
        email: 'admin@inventario.com',
        password: 'admin123',
        documentNumber: '12345678',
        names: 'Administrador General',
        legalName: 'Administrador General del Sistema',
        phone: '999888777',
        address: 'Sistema de Inventario',
      });

      if (result.success) {
        this.logger.log(`✅ Administrador general creado exitosamente: ${result.adminId}`);
        this.logger.log('📧 Email: admin@inventario.com');
        this.logger.log('🔑 Contraseña: admin123');
        this.logger.warn('⚠️  IMPORTANTE: Cambia la contraseña por defecto en producción');
      } else {
        this.logger.error(`❌ Error al crear administrador general: ${result.message}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error durante la inicialización del administrador general: ${error.message}`);
    }
  }
}
