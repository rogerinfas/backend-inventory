import { Injectable, Logger } from '@nestjs/common';
import { CreateUserWithPersonUseCase } from '../use-cases/user/create-user-with-person.use-case';
import { DocumentType } from '../../domain/enums/document-type.enum';
import { UserRole } from '../../domain/enums/user-role.enum';
import { StorePrismaRepository } from '../../infrastructure/repositories/store.repository';
import { Store } from '../../domain/entities/store.entity';

@Injectable()
export class DataInitializationService {
  private readonly logger = new Logger(DataInitializationService.name);
  
  // SUPERADMIN credentials (no store)
  private readonly SUPERADMIN_EMAIL = 'superadmin@inventario.com';
  private readonly SUPERADMIN_PASSWORD = 'SuperAdmin123!';
  
  // ADMIN credentials (associated to default store)
  private readonly ADMIN_EMAIL = 'admin@inventario.com';
  private readonly ADMIN_PASSWORD = 'Admin123!';
  
  // SELLER credentials (associated to default store)
  private readonly SELLER_EMAIL = 'seller@inventario.com';
  private readonly SELLER_PASSWORD = 'Seller123!';
  
  // Default store configuration
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
   * Initialize the system with default users if they don't exist
   */
  async initializeSuperadmin(): Promise<void> {
    try {
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.log('🚀 Initializing system data...');
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // 1. Ensure default store exists
      const storeId = await this.ensureDefaultStore();

      // 2. Create superadmin user if doesn't exist (no store association)
      await this.ensureSuperadminUser();

      // 3. Create admin user if doesn't exist (associated to default store)
      if (storeId) {
        await this.ensureAdminUser(storeId);
      } else {
        this.logger.warn('⚠️ Skipping ADMIN user creation - no default store available');
      }

      // 4. Create seller user if doesn't exist (associated to default store)
      if (storeId) {
        await this.ensureSellerUser(storeId);
      } else {
        this.logger.warn('⚠️ Skipping SELLER user creation - no default store available');
      }

      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.log('✅ System initialization completed successfully');
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Log all credentials in development
      this.logAllDefaultCredentials();
    } catch (error) {
      this.logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.error(`❌ Critical error during system initialization: ${error.message}`);
      this.logger.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      if (process.env.NODE_ENV === 'development') {
        this.logger.debug(error.stack);
      }
      
      // Re-throw critical errors that should stop the application
      throw error;
    }
  }

  /**
   * Ensure the default store exists in the database
   */
  private async ensureDefaultStore(): Promise<string | null> {
    try {
      this.logger.log('Checking for default store...');
      
      let store = await this.storeRepository.findById(this.DEFAULT_STORE_ID);
      
      if (!store) {
        this.logger.log('Creating default store...');
        
        store = Store.create(
          this.DEFAULT_STORE_ID,
          this.DEFAULT_STORE_NAME,
          this.DEFAULT_STORE_RUC,
          this.DEFAULT_STORE_ADDRESS,
          this.DEFAULT_STORE_PHONE
        );
        
        // Check if repository has save method
        if (typeof this.storeRepository.save === 'function') {
          await this.storeRepository.save(store);
          this.logger.log('✅ Default store created successfully');
          return this.DEFAULT_STORE_ID;
        } else {
          this.logger.warn('⚠️ Store repository does not implement save method');
          return null;
        }
      }
      
      this.logger.log('✅ Default store already exists');
      return this.DEFAULT_STORE_ID;
    } catch (error) {
      this.logger.warn(`⚠️ Could not ensure default store: ${error.message}`);
      // Return null to indicate store is not available
      return null;
    }
  }

  /**
   * Ensure the superadmin user exists (not associated to any store)
   */
  private async ensureSuperadminUser(): Promise<void> {
    try {
      this.logger.log('📌 Checking for SUPERADMIN user...');
      
      await this.createUserWithPersonUseCase.execute({
        email: this.SUPERADMIN_EMAIL,
        password: this.SUPERADMIN_PASSWORD,
        role: UserRole.SUPERADMIN,
        documentType: DocumentType.DNI,
        documentNumber: '00000000',
        names: 'Super Administrador',
        phone: this.DEFAULT_STORE_PHONE,
        storeId: null, // SUPERADMIN is not associated to any store
      });
      
      this.logger.log('✅ SUPERADMIN user created successfully');
    } catch (error) {
      if (this.isUserAlreadyExistsError(error)) {
        this.logger.log('ℹ️ SUPERADMIN user already exists');
        return;
      }
      
      // For other errors, log and re-throw
      this.logger.error(`❌ Error creating SUPERADMIN user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Ensure the admin user exists (associated to default store)
   */
  private async ensureAdminUser(storeId: string): Promise<void> {
    try {
      this.logger.log('📌 Checking for ADMIN user...');
      
      await this.createUserWithPersonUseCase.execute({
        email: this.ADMIN_EMAIL,
        password: this.ADMIN_PASSWORD,
        role: UserRole.ADMIN,
        documentType: DocumentType.DNI,
        documentNumber: '11111111',
        names: 'Administrador de Tienda',
        phone: this.DEFAULT_STORE_PHONE,
        storeId: storeId, // ADMIN is associated to default store
      });
      
      this.logger.log('✅ ADMIN user created successfully');
    } catch (error) {
      if (this.isUserAlreadyExistsError(error)) {
        this.logger.log('ℹ️ ADMIN user already exists');
        return;
      }
      
      // For other errors, log and re-throw
      this.logger.error(`❌ Error creating ADMIN user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Ensure the seller user exists (associated to default store)
   */
  private async ensureSellerUser(storeId: string): Promise<void> {
    try {
      this.logger.log('📌 Checking for SELLER user...');
      
      await this.createUserWithPersonUseCase.execute({
        email: this.SELLER_EMAIL,
        password: this.SELLER_PASSWORD,
        role: UserRole.SELLER,
        documentType: DocumentType.DNI,
        documentNumber: '22222222',
        names: 'Vendedor de Tienda',
        phone: this.DEFAULT_STORE_PHONE,
        storeId: storeId, // SELLER is associated to default store
      });
      
      this.logger.log('✅ SELLER user created successfully');
    } catch (error) {
      if (this.isUserAlreadyExistsError(error)) {
        this.logger.log('ℹ️ SELLER user already exists');
        return;
      }
      
      // For other errors, log and re-throw
      this.logger.error(`❌ Error creating SELLER user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if the error indicates the user already exists
   */
  private isUserAlreadyExistsError(error: any): boolean {
    const errorMessage = error.message?.toLowerCase() || '';
    const errorName = error.name?.toLowerCase() || '';
    
    return (
      errorMessage.includes('already exists') ||
      errorMessage.includes('ya existe') ||
      errorName.includes('alreadyexists') ||
      errorName === 'personalreadyexistserror'
    );
  }

  /**
   * Log all default credentials for development purposes
   */
  private logAllDefaultCredentials(): void {
    if (process.env.NODE_ENV === 'development') {
      this.logger.log('');
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.log('📋 DEFAULT USER CREDENTIALS (Development Only)');
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.log('');
      this.logger.log('🔐 SUPERADMIN (Global - No Store):');
      this.logger.log(`   Email:    ${this.SUPERADMIN_EMAIL}`);
      this.logger.log(`   Password: ${this.SUPERADMIN_PASSWORD}`);
      this.logger.log(`   DNI:      00000000`);
      this.logger.log('');
      this.logger.log('🔐 ADMIN (Store Administrator):');
      this.logger.log(`   Email:    ${this.ADMIN_EMAIL}`);
      this.logger.log(`   Password: ${this.ADMIN_PASSWORD}`);
      this.logger.log(`   DNI:      11111111`);
      this.logger.log(`   Store:    ${this.DEFAULT_STORE_NAME}`);
      this.logger.log('');
      this.logger.log('🔐 SELLER (Store Seller):');
      this.logger.log(`   Email:    ${this.SELLER_EMAIL}`);
      this.logger.log(`   Password: ${this.SELLER_PASSWORD}`);
      this.logger.log(`   DNI:      22222222`);
      this.logger.log(`   Store:    ${this.DEFAULT_STORE_NAME}`);
      this.logger.log('');
      this.logger.log('⚠️  IMPORTANT: Change these passwords in PRODUCTION!');
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.logger.log('');
    }
  }
}