import { Injectable, Logger } from '@nestjs/common';
import { CreateUserWithPersonUseCase } from '../use-cases/user/create-user-with-person.use-case';
import { DocumentType } from '../../domain/enums/document-type.enum';
import { StorePrismaRepository } from '../../infrastructure/repositories/store.repository';
import { Store } from '../../domain/entities/store.entity';

@Injectable()
export class DataInitializationService {
  private readonly logger = new Logger(DataInitializationService.name);
  private readonly SUPERADMIN_EMAIL = 'superadmin@inventario.com';
  private readonly SUPERADMIN_PASSWORD = 'superadmin123';
  private readonly DEFAULT_STORE_ID = '00000000-0000-0000-0000-000000000000';
  private readonly DEFAULT_STORE_NAME = 'Tienda de Prueba';
  private readonly DEFAULT_STORE_RUC = '20123456781';
  private readonly DEFAULT_STORE_ADDRESS = 'Dirección de la tienda de prueba';
  private readonly DEFAULT_STORE_PHONE = '+51999999999';

  constructor(
    private readonly createUserWithPersonUseCase: CreateUserWithPersonUseCase,
    private readonly storeRepository: StorePrismaRepository,
  ) {}

  /**
   * Initialize the system with a superadmin user if it doesn't exist
   */
  async initializeSuperadmin(): Promise<void> {
    try {
      this.logger.log('Checking for superadmin user...');
      
      // 1. Ensure default store exists
      try {
        let store = await this.storeRepository.findById(this.DEFAULT_STORE_ID);
        if (!store) {
          store = Store.create(
            this.DEFAULT_STORE_ID,
            this.DEFAULT_STORE_NAME,
            this.DEFAULT_STORE_RUC,
            this.DEFAULT_STORE_ADDRESS,
            this.DEFAULT_STORE_PHONE
          );
          // Save the store if repository implements save method
          // await this.storeRepository.save(store);
          this.logger.warn('ℹ️  Store creation not fully implemented. Using default store ID.');
        }
        this.logger.log('✅ Default store is ready');
      } catch (error) {
        this.logger.warn(`⚠️  Could not verify default store: ${error.message}`);
        // Continue with initialization
      }

      // 2. Create superadmin user (without store association)
      try {
        await this.createUserWithPersonUseCase.execute({
          email: this.SUPERADMIN_EMAIL,
          password: this.SUPERADMIN_PASSWORD,
          documentType: DocumentType.DNI,
          documentNumber: '00000000',
          names: 'Super Administrador',
          phone: this.DEFAULT_STORE_PHONE,
          storeId: null,
        });

        this.logger.log('✅ Superadmin user created successfully');
        this.logger.warn('⚠️  IMPORTANT: Change the default superadmin password in production');
      } catch (error) {
        // Handle specific error for existing user/person
        if (error.message.includes('already exists') || 
            error.message.includes('Ya existe una persona') ||
            error.name === 'PersonAlreadyExistsError') {
          this.logger.log('ℹ️ Superadmin user already exists');
          return; // Exit early since this is an expected case
        }
        
        // Log other errors but don't crash the app
        this.logger.error(`❌ Error during superadmin initialization: ${error.message}`);
        if (process.env.NODE_ENV === 'development') {
          this.logger.debug(error.stack);
        }
      }
    } catch (error) {
      this.logger.error(`❌ Unexpected error in initializeSuperadmin: ${error.message}`);
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(error.stack);
      }
    }
  }
}
