import { Injectable, Logger } from '@nestjs/common';
import { CreateUserWithPersonUseCase } from '../use-cases/user/create-user-with-person.use-case';
import { CreateCategoryUseCase } from '../use-cases/category/create-category.use-case';
import { CreateBrandUseCase } from '../use-cases/brand/create-brand.use-case';
import { CreateProductUseCase } from '../use-cases/product/create-product.use-case';
import { AddStockUseCase } from '../use-cases/product/add-stock.use-case';
import { CreateSupplierWithPersonUseCase } from '../use-cases/supplier/create-supplier-with-person.use-case';
import { CreateCustomerWithPersonUseCase } from '../use-cases/customer/create-customer-with-person.use-case';
import { CreateVoucherSeriesUseCase } from '../use-cases/voucher-series/create-voucher-series.use-case';
import { CreateSunatConfigUseCase } from '../use-cases/sunat-config/create-sunat-config.use-case';
import { CreatePurchaseUseCase } from '../use-cases/purchase/create-purchase.use-case';
import { CreateSaleUseCase } from '../use-cases/sale/create-sale.use-case';
import { DocumentType } from '../../domain/enums/document-type.enum';
import { UserRole } from '../../domain/enums/user-role.enum';
import { UnitOfMeasure } from '../../domain/enums/unit-of-measure.enum';
import { VoucherType } from '../../domain/enums/voucher-type.enum';
import { SunatEnvironment } from '../../domain/enums/sunat-environment.enum';
import { PurchaseDocumentType } from '../../domain/enums/purchase-document-type.enum';
import { StorePrismaRepository } from '../../infrastructure/repositories/store.repository';
import { ProductPrismaRepository } from '../../infrastructure/repositories/product.repository';
import { SupplierPrismaRepository } from '../../infrastructure/repositories/supplier.repository';
import { CustomerPrismaRepository } from '../../infrastructure/repositories/customer.repository';
import { UserPrismaRepository } from '../../infrastructure/repositories/user.repository';
import { Store } from '../../domain/entities/store.entity';
import { SupplierAlreadyExistsError, CustomerAlreadyExistsError, PersonAlreadyExistsError, VoucherSeriesAlreadyExistsError, SunatConfigAlreadyExistsError } from '../errors/domain-errors';

@Injectable()
export class DataInitializationService {
  private readonly logger = new Logger(DataInitializationService.name);
  
  // SUPERADMIN credentials (no store)
  private readonly SUPERADMIN_EMAIL = 'superadmin@inventario.com';
  private readonly SUPERADMIN_PASSWORD = 'superadmin123';
  
  // ADMIN credentials (associated to default store)
  private readonly ADMIN_EMAIL = 'admin@inventario.com';
  private readonly ADMIN_PASSWORD = 'admin123';
  
  // SELLER credentials (associated to default store)
  private readonly SELLER_EMAIL = 'seller@inventario.com';
  private readonly SELLER_PASSWORD = 'seller123';
  
  // Default store configuration
  private readonly DEFAULT_STORE_ID = '123e4567-e89b-12d3-a456-426614174000';
  private readonly DEFAULT_STORE_NAME = 'Tienda de Prueba';
  private readonly DEFAULT_STORE_RUC = '20123456781';
  private readonly DEFAULT_STORE_ADDRESS = 'Dirección de la tienda de prueba';
  private readonly DEFAULT_STORE_PHONE = '+51999999999';

  // Default suppliers
  private readonly DEFAULT_SUPPLIER_1_DOCUMENT = '12345678901';
  private readonly DEFAULT_SUPPLIER_2_DOCUMENT = '20987654321';
  private readonly DEFAULT_SUPPLIER_3_DOCUMENT = '20555666777';
  
  // Default customers
  private readonly DEFAULT_CUSTOMER_1_DOCUMENT = '72190044';
  private readonly DEFAULT_CUSTOMER_2_DOCUMENT = '45678912';
  private readonly DEFAULT_CUSTOMER_3_DOCUMENT = '78945612';

  constructor(
    private readonly createUserWithPersonUseCase: CreateUserWithPersonUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly createBrandUseCase: CreateBrandUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly addStockUseCase: AddStockUseCase,
    private readonly createSupplierWithPersonUseCase: CreateSupplierWithPersonUseCase,
    private readonly createCustomerWithPersonUseCase: CreateCustomerWithPersonUseCase,
    private readonly createVoucherSeriesUseCase: CreateVoucherSeriesUseCase,
    private readonly createSunatConfigUseCase: CreateSunatConfigUseCase,
    private readonly createPurchaseUseCase: CreatePurchaseUseCase,
    private readonly createSaleUseCase: CreateSaleUseCase,
    private readonly storeRepository: StorePrismaRepository,
    private readonly productRepository: ProductPrismaRepository,
    private readonly supplierRepository: SupplierPrismaRepository,
    private readonly customerRepository: CustomerPrismaRepository,
    private readonly userRepository: UserPrismaRepository,
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

      // 5. Create default categories, brands and products
      if (storeId) {
        await this.ensureDefaultCatalog(storeId);
      } else {
        this.logger.warn('⚠️ Skipping catalog creation - no default store available');
      }

      // 6. Crear proveedores y clientes por defecto
      if (storeId) {
        await this.ensureDefaultSuppliers(storeId);
        await this.ensureDefaultCustomers(storeId);
      } else {
        this.logger.warn('⚠️ Skipping suppliers/customers creation - no default store available');
      }

      // 7. Crear series de comprobantes por defecto
      if (storeId) {
        await this.ensureDefaultVoucherSeries(storeId);
      } else {
        this.logger.warn('⚠️ Skipping voucher series creation - no default store available');
      }

      // 8. Crear configuración SUNAT por defecto
      if (storeId) {
        await this.ensureDefaultSunatConfig(storeId);
      } else {
        this.logger.warn('⚠️ Skipping SUNAT config creation - no default store available');
      }

      // 9. Crear compras de ejemplo
      if (storeId) {
        await this.ensureDefaultPurchases(storeId);
      } else {
        this.logger.warn('⚠️ Skipping purchases creation - no default store available');
      }

      // 10. Crear ventas de ejemplo
      if (storeId) {
        await this.ensureDefaultSales(storeId);
      } else {
        this.logger.warn('⚠️ Skipping sales creation - no default store available');
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
   * Ensure default catalog (categories, brands, products) exists
   */
  private async ensureDefaultCatalog(storeId: string): Promise<void> {
    try {
      this.logger.log('📦 Initializing default catalog...');

      // Create categories
      const categories = await this.ensureDefaultCategories();
      
      // Create brands
      const brands = await this.ensureDefaultBrands();
      
      // Create products
      await this.ensureDefaultProducts(storeId, categories, brands);

      this.logger.log('✅ Default catalog initialized');
    } catch (error) {
      this.logger.warn(`⚠️ Could not initialize catalog: ${error.message}`);
    }
  }

  private async ensureDefaultCategories(): Promise<Map<string, string>> {
    const categoryMap = new Map<string, string>();
    const categories = [
      { name: 'Laptops', description: 'Computadoras portátiles' },
      { name: 'Smartphones', description: 'Teléfonos inteligentes' },
      { name: 'Accesorios', description: 'Accesorios tecnológicos' },
      { name: 'Periféricos', description: 'Teclados, mouse, audífonos' },
      { name: 'Tablets', description: 'Tabletas y iPads' },
      { name: 'Monitores', description: 'Pantallas y monitores' },
      { name: 'Audio', description: 'Audífonos y parlantes' },
      { name: 'Almacenamiento', description: 'Discos duros y memorias USB' },
    ];

    for (const cat of categories) {
      try {
        const result = await this.createCategoryUseCase.execute(cat);
        categoryMap.set(cat.name, result.id);
        this.logger.log(`   ✓ Category: ${cat.name}`);
      } catch (error) {
        if (error.message?.includes('ya existe')) {
          this.logger.log(`   ℹ️ Category already exists: ${cat.name}`);
        }
      }
    }

    return categoryMap;
  }

  private async ensureDefaultBrands(): Promise<Map<string, string>> {
    const brandMap = new Map<string, string>();
    const brands = ['Apple', 'Samsung', 'Lenovo', 'HP', 'Logitech', 'Dell', 'Asus', 'Sony', 'Kingston', 'LG'];

    for (const brandName of brands) {
      try {
        const result = await this.createBrandUseCase.execute({ name: brandName });
        brandMap.set(brandName, result.id);
        this.logger.log(`   ✓ Brand: ${brandName}`);
      } catch (error) {
        if (error.message?.includes('ya existe')) {
          this.logger.log(`   ℹ️ Brand already exists: ${brandName}`);
        }
      }
    }

    return brandMap;
  }

  private async ensureDefaultProducts(
    storeId: string,
    categories: Map<string, string>,
    brands: Map<string, string>
  ): Promise<void> {
    const products = [
      {
        sku: 'LAP-HP-001',
        name: 'Laptop HP Pavilion 15',
        description: 'Intel i5, 8GB RAM, 256GB SSD',
        categoryName: 'Laptops',
        brandName: 'HP',
        purchasePrice: 1500.00,
        salePrice: 1899.00,
        minimumStock: 3,
        initialStock: 10,
      },
      {
        sku: 'LAP-LEN-002',
        name: 'Laptop Lenovo IdeaPad 3',
        description: 'AMD Ryzen 5, 8GB RAM, 512GB SSD',
        categoryName: 'Laptops',
        brandName: 'Lenovo',
        purchasePrice: 1400.00,
        salePrice: 1799.00,
        minimumStock: 3,
        initialStock: 12,
      },
      {
        sku: 'PHN-SAM-001',
        name: 'Samsung Galaxy A54',
        description: '128GB, 6GB RAM, 5G',
        categoryName: 'Smartphones',
        brandName: 'Samsung',
        purchasePrice: 800.00,
        salePrice: 999.00,
        minimumStock: 5,
        initialStock: 8,
      },
      {
        sku: 'PHN-APP-001',
        name: 'iPhone 13',
        description: '128GB, Negro',
        categoryName: 'Smartphones',
        brandName: 'Apple',
        purchasePrice: 2000.00,
        salePrice: 2499.00,
        minimumStock: 2,
        initialStock: 6,
      },
      {
        sku: 'ACC-LOG-001',
        name: 'Mouse Logitech MX Master 3',
        description: 'Inalámbrico, Ergonómico',
        categoryName: 'Accesorios',
        brandName: 'Logitech',
        purchasePrice: 80.00,
        salePrice: 119.00,
        minimumStock: 10,
      },
      {
        sku: 'ACC-LOG-002',
        name: 'Teclado Logitech K380',
        description: 'Bluetooth, Multi-dispositivo',
        categoryName: 'Periféricos',
        brandName: 'Logitech',
        purchasePrice: 60.00,
        salePrice: 89.00,
        minimumStock: 10,
        initialStock: 15,
      },
      {
        sku: 'LAP-DELL-003',
        name: 'Laptop Dell Inspiron 15',
        description: 'Intel i7, 16GB RAM, 512GB SSD',
        categoryName: 'Laptops',
        brandName: 'Dell',
        purchasePrice: 1800.00,
        salePrice: 2299.00,
        minimumStock: 2,
        initialStock: 5,
      },
      {
        sku: 'LAP-ASUS-004',
        name: 'Laptop Asus VivoBook 14',
        description: 'AMD Ryzen 7, 8GB RAM, 256GB SSD',
        categoryName: 'Laptops',
        brandName: 'Asus',
        purchasePrice: 1300.00,
        salePrice: 1699.00,
        minimumStock: 3,
        initialStock: 8,
      },
      {
        sku: 'TAB-SAM-001',
        name: 'Samsung Galaxy Tab S8',
        description: '128GB, WiFi, 11 pulgadas',
        categoryName: 'Tablets',
        brandName: 'Samsung',
        purchasePrice: 900.00,
        salePrice: 1199.00,
        minimumStock: 4,
        initialStock: 6,
      },
      {
        sku: 'TAB-APP-001',
        name: 'iPad Air 5ta Gen',
        description: '256GB, WiFi, 10.9 pulgadas',
        categoryName: 'Tablets',
        brandName: 'Apple',
        purchasePrice: 1500.00,
        salePrice: 1899.00,
        minimumStock: 3,
        initialStock: 4,
      },
      {
        sku: 'MON-LG-001',
        name: 'Monitor LG UltraWide 29"',
        description: '2560x1080, IPS, 75Hz',
        categoryName: 'Monitores',
        brandName: 'LG',
        purchasePrice: 450.00,
        salePrice: 599.00,
        minimumStock: 5,
        initialStock: 12,
      },
      {
        sku: 'MON-ASUS-001',
        name: 'Monitor Asus Gaming 27"',
        description: '1920x1080, 144Hz, 1ms',
        categoryName: 'Monitores',
        brandName: 'Asus',
        purchasePrice: 550.00,
        salePrice: 749.00,
        minimumStock: 4,
        initialStock: 7,
      },
      {
        sku: 'AUD-SONY-001',
        name: 'Audífonos Sony WH-1000XM5',
        description: 'Bluetooth, Cancelación de ruido',
        categoryName: 'Audio',
        brandName: 'Sony',
        purchasePrice: 300.00,
        salePrice: 399.00,
        minimumStock: 8,
        initialStock: 20,
      },
      {
        sku: 'AUD-APP-001',
        name: 'AirPods Pro 2da Gen',
        description: 'Bluetooth, Cancelación de ruido',
        categoryName: 'Audio',
        brandName: 'Apple',
        purchasePrice: 200.00,
        salePrice: 279.00,
        minimumStock: 10,
        initialStock: 25,
      },
      {
        sku: 'STO-KING-001',
        name: 'Memoria USB Kingston 64GB',
        description: 'USB 3.0, Alta velocidad',
        categoryName: 'Almacenamiento',
        brandName: 'Kingston',
        purchasePrice: 15.00,
        salePrice: 25.00,
        minimumStock: 20,
        initialStock: 50,
      },
      {
        sku: 'STO-KING-002',
        name: 'Disco Duro Externo Kingston 1TB',
        description: 'USB 3.0, Portátil',
        categoryName: 'Almacenamiento',
        brandName: 'Kingston',
        purchasePrice: 80.00,
        salePrice: 119.00,
        minimumStock: 10,
        initialStock: 18,
      },
      {
        sku: 'PHN-SAM-002',
        name: 'Samsung Galaxy S23',
        description: '256GB, 8GB RAM, 5G',
        categoryName: 'Smartphones',
        brandName: 'Samsung',
        purchasePrice: 1200.00,
        salePrice: 1599.00,
        minimumStock: 4,
        initialStock: 10,
      },
      {
        sku: 'PER-LOG-003',
        name: 'Webcam Logitech C920',
        description: 'Full HD 1080p, Micrófono integrado',
        categoryName: 'Periféricos',
        brandName: 'Logitech',
        purchasePrice: 70.00,
        salePrice: 99.00,
        minimumStock: 8,
        initialStock: 15,
      },
    ];

    for (const prod of products) {
      try {
        const createdProduct = await this.createProductUseCase.execute({
          storeId,
          categoryId: categories.get(prod.categoryName),
          brandId: brands.get(prod.brandName),
          sku: prod.sku,
          name: prod.name,
          description: prod.description,
          purchasePrice: prod.purchasePrice,
          salePrice: prod.salePrice,
          minimumStock: prod.minimumStock,
          unitOfMeasure: UnitOfMeasure.UNIT,
        });
        
        // Agregar stock inicial (variable por producto)
        const stockQuantity = prod.initialStock || 10;
        await this.addStockUseCase.execute(createdProduct.id, {
          quantity: stockQuantity,
          reason: 'Stock inicial'
        });
        
        this.logger.log(`   ✓ Product: ${prod.name} (Stock: ${stockQuantity})`);
      } catch (error) {
        if (error.message?.includes('ya existe')) {
          this.logger.log(`   ℹ️ Product already exists: ${prod.name}`);
        }
      }
    }
  }

  private async ensureDefaultSuppliers(storeId: string): Promise<void> {
    this.logger.log('📌 Checking for default suppliers...');
    
    const suppliers = [
      {
        documentNumber: this.DEFAULT_SUPPLIER_1_DOCUMENT,
        names: 'Distribuidora Tech S.A.C.',
        phone: '+51987654321'
      },
      {
        documentNumber: this.DEFAULT_SUPPLIER_2_DOCUMENT,
        names: 'Importaciones Global E.I.R.L.',
        phone: '+51976543210'
      },
      {
        documentNumber: this.DEFAULT_SUPPLIER_3_DOCUMENT,
        names: 'Comercial Lima S.A.',
        phone: '+51965432109'
      }
    ];

    for (const supplier of suppliers) {
      try {
        await this.createSupplierWithPersonUseCase.execute({
          storeId,
          documentType: DocumentType.RUC,
          documentNumber: supplier.documentNumber,
          names: supplier.names,
          phone: supplier.phone
        });
        
        this.logger.log(`   ✓ Supplier: ${supplier.names}`);
      } catch (error) {
        if (error instanceof SupplierAlreadyExistsError || error instanceof PersonAlreadyExistsError) {
          this.logger.log(`   ℹ️ Supplier already exists: ${supplier.names}`);
        } else if (error.message?.includes('ya existe') || error.message?.includes('already exists')) {
          this.logger.log(`   ℹ️ Supplier already exists: ${supplier.names}`);
        } else {
          this.logger.warn(`   ⚠️ Could not create supplier ${supplier.names}: ${error.message}`);
        }
      }
    }
    
    this.logger.log('✅ Default suppliers initialization completed');
  }

  private async ensureDefaultCustomers(storeId: string): Promise<void> {
    this.logger.log('📌 Checking for default customers...');
    
    const customers = [
      {
        documentNumber: this.DEFAULT_CUSTOMER_1_DOCUMENT,
        names: 'Juan Pérez García',
        phone: '+51987654321'
      },
      {
        documentNumber: this.DEFAULT_CUSTOMER_2_DOCUMENT,
        names: 'María López Rodríguez',
        phone: '+51976543210'
      },
      {
        documentNumber: this.DEFAULT_CUSTOMER_3_DOCUMENT,
        names: 'Carlos Sánchez Díaz',
        phone: '+51965432109'
      }
    ];

    for (const customer of customers) {
      try {
        await this.createCustomerWithPersonUseCase.execute({
          storeId,
          documentType: DocumentType.DNI,
          documentNumber: customer.documentNumber,
          names: customer.names,
          phone: customer.phone
        });
        
        this.logger.log(`   ✓ Customer: ${customer.names}`);
      } catch (error) {
        if (error instanceof CustomerAlreadyExistsError || error instanceof PersonAlreadyExistsError) {
          this.logger.log(`   ℹ️ Customer already exists: ${customer.names}`);
        } else if (error.message?.includes('ya existe') || error.message?.includes('already exists')) {
          this.logger.log(`   ℹ️ Customer already exists: ${customer.names}`);
        } else {
          this.logger.warn(`   ⚠️ Could not create customer ${customer.names}: ${error.message}`);
        }
      }
    }
    
    this.logger.log('✅ Default customers initialization completed');
  }

  private async ensureDefaultVoucherSeries(storeId: string): Promise<void> {
    this.logger.log('📌 Checking for default voucher series...');
    
    const voucherSeries = [
      { voucherType: VoucherType.RECEIPT, series: 'B001', currentNumber: 1 },
      { voucherType: VoucherType.INVOICE, series: 'F001', currentNumber: 1 },
      { voucherType: VoucherType.SALE_NOTE, series: 'N001', currentNumber: 1 },
    ];

    for (const series of voucherSeries) {
      try {
        await this.createVoucherSeriesUseCase.execute({
          storeId,
          voucherType: series.voucherType,
          series: series.series,
          currentNumber: series.currentNumber,
        });
        
        this.logger.log(`   ✓ Voucher Series: ${series.voucherType} - ${series.series}`);
      } catch (error) {
        if (error instanceof VoucherSeriesAlreadyExistsError) {
          this.logger.log(`   ℹ️ Voucher series already exists: ${series.voucherType} - ${series.series}`);
        } else if (error.message?.includes('ya existe') || error.message?.includes('already exists')) {
          this.logger.log(`   ℹ️ Voucher series already exists: ${series.voucherType} - ${series.series}`);
        } else {
          this.logger.warn(`   ⚠️ Could not create voucher series ${series.voucherType} - ${series.series}: ${error.message}`);
        }
      }
    }
    
    this.logger.log('✅ Default voucher series initialization completed');
  }

  private async ensureDefaultSunatConfig(storeId: string): Promise<void> {
    try {
      this.logger.log('📌 Checking for default SUNAT config...');
      
      await this.createSunatConfigUseCase.execute({
        storeId,
        solUsername: 'MODDATOS',
        solPassword: 'moddatos',
        environment: SunatEnvironment.TEST,
        apiUrl: 'https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService',
      });
      
      this.logger.log('✅ Default SUNAT config created successfully');
    } catch (error) {
      if (error instanceof SunatConfigAlreadyExistsError) {
        this.logger.log('ℹ️ Default SUNAT config already exists');
      } else if (error.message?.includes('ya existe') || error.message?.includes('already exists')) {
        this.logger.log('ℹ️ Default SUNAT config already exists');
      } else {
        this.logger.warn(`⚠️ Could not create default SUNAT config: ${error.message}`);
      }
    }
  }

  private async ensureDefaultPurchases(storeId: string): Promise<void> {
    try {
      this.logger.log('📌 Checking for default purchases...');
      
      // Obtener productos, proveedores y usuario admin
      const products = await this.productRepository.findByStoreId(storeId);
      const suppliers = await this.supplierRepository.findByStoreId(storeId);
      const adminUser = await this.userRepository.findByEmail(this.ADMIN_EMAIL);

      if (products.length === 0 || suppliers.length === 0 || !adminUser) {
        this.logger.warn('⚠️ No hay suficientes datos para crear compras (productos, proveedores o usuario admin)');
        return;
      }

      // Crear 2 compras de ejemplo
      const purchases = [
        {
          supplierId: suppliers[0].id,
          userId: adminUser.id,
          documentNumber: 'F001-00000001',
          documentType: PurchaseDocumentType.INVOICE,
          purchaseDate: new Date().toISOString(),
          notes: 'Compra inicial de productos tecnológicos',
          details: [
            { productId: products[0].id, quantity: 5, unitPrice: products[0].purchasePrice, discount: 0 },
            { productId: products[1].id, quantity: 3, unitPrice: products[1].purchasePrice, discount: 0 },
          ]
        },
        {
          supplierId: suppliers[1].id,
          userId: adminUser.id,
          documentNumber: 'F001-00000002',
          documentType: PurchaseDocumentType.INVOICE,
          purchaseDate: new Date().toISOString(),
          notes: 'Reposición de stock',
          details: [
            { productId: products[2].id, quantity: 10, unitPrice: products[2].purchasePrice, discount: 0 },
            { productId: products[3].id, quantity: 2, unitPrice: products[3].purchasePrice, discount: 0 },
          ]
        }
      ];

      for (const purchase of purchases) {
        try {
          await this.createPurchaseUseCase.execute({
            storeId,
            ...purchase
          });
          this.logger.log(`   ✓ Purchase: ${purchase.documentNumber}`);
        } catch (error) {
          if (error.message?.includes('ya existe') || error.message?.includes('already exists')) {
            this.logger.log(`   ℹ️ Purchase already exists: ${purchase.documentNumber}`);
          } else {
            this.logger.warn(`   ⚠️ Could not create purchase: ${error.message}`);
          }
        }
      }
      
      this.logger.log('✅ Default purchases initialization completed');
    } catch (error) {
      this.logger.warn(`⚠️ Could not initialize purchases: ${error.message}`);
    }
  }

  private async ensureDefaultSales(storeId: string): Promise<void> {
    try {
      this.logger.log('📌 Checking for default sales...');
      
      // Obtener productos, clientes y usuario admin
      const products = await this.productRepository.findByStoreId(storeId);
      const customers = await this.customerRepository.findByStoreId(storeId);
      const adminUser = await this.userRepository.findByEmail(this.ADMIN_EMAIL);

      if (products.length === 0 || customers.length === 0 || !adminUser) {
        this.logger.warn('⚠️ No hay suficientes datos para crear ventas (productos, clientes o usuario admin)');
        return;
      }

      // Crear 3 ventas de ejemplo
      const sales = [
        {
          customerId: customers[0].id,
          userId: adminUser.id,
          documentType: VoucherType.RECEIPT,
          series: 'B001',
          saleDate: new Date().toISOString(),
          notes: 'Venta al contado',
          details: [
            { productId: products[0].id, quantity: 1, unitPrice: products[0].salePrice, discount: 0 },
            { productId: products[4].id, quantity: 2, unitPrice: products[4].salePrice, discount: 0 },
          ]
        },
        {
          customerId: customers[1].id,
          userId: adminUser.id,
          documentType: VoucherType.RECEIPT,
          series: 'B001',
          saleDate: new Date().toISOString(),
          notes: 'Venta con descuento',
          details: [
            { productId: products[1].id, quantity: 1, unitPrice: products[1].salePrice, discount: 50 },
            { productId: products[5].id, quantity: 1, unitPrice: products[5].salePrice, discount: 0 },
          ]
        },
        {
          customerId: customers[2].id,
          userId: adminUser.id,
          documentType: VoucherType.INVOICE,
          series: 'F001',
          saleDate: new Date().toISOString(),
          notes: 'Venta corporativa',
          details: [
            { productId: products[2].id, quantity: 3, unitPrice: products[2].salePrice, discount: 0 },
            { productId: products[3].id, quantity: 1, unitPrice: products[3].salePrice, discount: 100 },
          ]
        }
      ];

      for (let i = 0; i < sales.length; i++) {
        const sale = sales[i];
        try {
          await this.createSaleUseCase.execute({
            storeId,
            ...sale
          });
          this.logger.log(`   ✓ Sale: ${sale.series}-${String(i + 1).padStart(8, '0')}`);
        } catch (error) {
          if (error.message?.includes('ya existe') || error.message?.includes('already exists')) {
            this.logger.log(`   ℹ️ Sale already exists: ${sale.series}-${String(i + 1).padStart(8, '0')}`);
          } else {
            this.logger.warn(`   ⚠️ Could not create sale: ${error.message}`);
          }
        }
      }
      
      this.logger.log('✅ Default sales initialization completed');
    } catch (error) {
      this.logger.warn(`⚠️ Could not initialize sales: ${error.message}`);
    }
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
      this.logger.log('🔐 SUPERADMIN (Global - No Store):');
      this.logger.log(`   Email:    ${this.SUPERADMIN_EMAIL}`);
      this.logger.log(`   Password: ${this.SUPERADMIN_PASSWORD}`);
      this.logger.log('🔐 ADMIN (Store Administrator):');
      this.logger.log(`   Email:    ${this.ADMIN_EMAIL}`);
      this.logger.log(`   Password: ${this.ADMIN_PASSWORD}`);
      this.logger.log(`   Store:    ${this.DEFAULT_STORE_NAME}`);
      this.logger.log('🔐 SELLER (Store Seller):');
      this.logger.log(`   Email:    ${this.SELLER_EMAIL}`);
      this.logger.log(`   Password: ${this.SELLER_PASSWORD}`);
      this.logger.log(`   Store:    ${this.DEFAULT_STORE_NAME}`);
      this.logger.log('⚠️  IMPORTANT: Change these passwords in PRODUCTION!');
      this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
  }
}