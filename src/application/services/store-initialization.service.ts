import { Injectable, Logger, Inject } from '@nestjs/common';
import { CreateStoreUseCase } from '../use-cases/store/create-store.use-case';
import { CreateUserWithPersonUseCase } from '../use-cases/user/create-user-with-person.use-case';
import type { StoreRepository } from '../../domain/repositories/store.repository';
import { UserRole } from '../../domain/enums/user-role.enum';
import { DocumentType } from '../../domain/enums/document-type.enum';

@Injectable()
export class StoreInitializationService {
  private readonly logger = new Logger(StoreInitializationService.name);

  constructor(
    private readonly createStoreUseCase: CreateStoreUseCase,
    private readonly createUserWithPersonUseCase: CreateUserWithPersonUseCase,
    @Inject('StoreRepository')
    private readonly storeRepository: StoreRepository,
  ) {}

  /**
   * Inicializa una tienda de demostración con tres usuarios de diferentes roles
   * Se ejecuta al arrancar la aplicación si no existe ninguna tienda
   */
  async initializeDemoStore(): Promise<void> {
    try {
      this.logger.log('Iniciando verificación de tienda de demostración...');

      // Verificar si ya existe alguna tienda
      const existingStores = await this.storeRepository.findMany();
      if (existingStores.length > 0) {
        this.logger.log('Ya existen tiendas, saltando inicialización de tienda demo');
        return;
      }

      // Crear la tienda de demostración
      const storeResult = await this.createStoreUseCase.execute({
        businessName: 'TechStore Perú',
        ruc: '20123456789',
        address: 'Av. Javier Prado Este 4200, San Borja, Lima',
        phone: '+51987654321',
        logoUrl: 'https://techstoreperu.com/logo.png'
      });

      this.logger.log(`✅ Tienda de demostración creada exitosamente: ${storeResult.id}`);

      // Crear usuarios de demostración
      const users = [
        {
          role: UserRole.ADMIN,
          data: {
            documentType: DocumentType.DNI,
            documentNumber: '12345678',
            names: 'María Elena Rodríguez',
            phone: '+51987654320',
            email: 'maria.rodriguez@techstoreperu.com',
            password: 'Admin123!',
            storeId: storeResult.id
          }
        },
        {
          role: UserRole.SELLER,
          data: {
            documentType: DocumentType.DNI,
            documentNumber: '87654321',
            names: 'Carlos Alberto Mendoza',
            phone: '+51987654319',
            email: 'carlos.mendoza@techstoreperu.com',
            password: 'Seller123!',
            storeId: storeResult.id
          }
        },
        {
          role: UserRole.SELLER,
          data: {
            documentType: DocumentType.DNI,
            documentNumber: '11223344',
            names: 'Ana Patricia Silva',
            phone: '+51987654318',
            email: 'ana.silva@techstoreperu.com',
            password: 'Seller123!',
            storeId: storeResult.id
          }
        }
      ];

      // Crear cada usuario
      for (const user of users) {
        try {
          const userResult = await this.createUserWithPersonUseCase.execute(user.data);
          this.logger.log(`✅ Usuario ${user.role} creado exitosamente: ${userResult.id}`);
          this.logger.log(`📧 Email: ${user.data.email}`);
          this.logger.log(`🔑 Contraseña: ${user.data.password}`);
        } catch (error) {
          this.logger.error(`❌ Error al crear usuario ${user.role}: ${error.message}`);
        }
      }

      this.logger.log('🎉 Inicialización de tienda de demostración completada');
      this.logger.warn('⚠️  IMPORTANTE: Cambia las contraseñas por defecto en producción');

    } catch (error) {
      this.logger.error(`❌ Error durante la inicialización de la tienda de demostración: ${error.message}`);
    }
  }
}
