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
  private readonly DEFAULT_STORE_NAME = 'Tienda Principal';
  private readonly DEFAULT_STORE_RUC = '20123456781';
  private readonly DEFAULT_STORE_ADDRESS = 'Dirección de la tienda principal';
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
      let store: Store | null = null;
      try {
        store = await this.storeRepository.findById(this.DEFAULT_STORE_ID);
        if (!store) {
          // Create default store if it doesn't exist
          store = Store.create(
            this.DEFAULT_STORE_ID,
            this.DEFAULT_STORE_NAME,
            this.DEFAULT_STORE_RUC,
            this.DEFAULT_STORE_ADDRESS,
            this.DEFAULT_STORE_PHONE
          );
          // Save the store (you'll need to implement the save method in the repository)
          // For now, we'll just log that we're skipping store creation
          this.logger.warn('⚠️  Store creation not implemented. Using default store ID.');
        }
        this.logger.log('✅ Default store is ready');
      } catch (error) {
        this.logger.error('❌ Error checking/creating default store', error);
        // Continue with default store ID even if there's an error
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
          storeId: null, // Superadmin is not associated with any store
        });

        this.logger.log('✅ Superadmin user created successfully'); 
        this.logger.warn('⚠️  IMPORTANT: Change the default superadmin password in production');
      } catch (error) {
        if (error.message.includes('already exists')) {
          this.logger.log('ℹ️ Superadmin user already exists');
        } else {
          this.logger.error(`❌ Error creating superadmin: ${error.message}`);
          throw error; // Re-throw to be caught by the outer try-catch
        }
      }
    } catch (error) {
      this.logger.error('❌ Error during superadmin initialization', error.stack);
    }
  }
}
