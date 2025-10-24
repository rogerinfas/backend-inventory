import { PrismaClient, DocumentType, EntityStatus } from '@prisma/client';
import { UserRole } from '../src/domain/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de semilla...');

  // 1. Crear tienda de prueba
  console.log('Creando tienda de prueba...');
  const store = await prisma.store.upsert({
    where: { ruc: '20123456789' },
    update: {},
    create: {
      businessName: 'Tienda Principal E.I.R.L.',
      ruc: '20123456789',
      address: 'Av. Principal 123',
      phone: '987654321',
      status: EntityStatus.ACTIVE,
    },
  });
  console.log('Tienda creada:', store);

  // 2. Crear persona para el super administrador
  console.log('Creando persona para el super administrador...');
  const superAdminPerson = await prisma.person.upsert({
    where: { documentNumber: '72190044' },
    update: {},
    create: {
      documentType: DocumentType.DNI,
      documentNumber: '72190044',
      names: 'Super Administrador',
      phone: '999888777',
      status: EntityStatus.ACTIVE,
    },
  });
  console.log('Persona super administradora creada:', superAdminPerson);

  // 3. Crear super administrador (sin tienda asignada)
  console.log('Creando super administrador...');
  const superAdminPassword = await bcrypt.hash('superadmin123', 10);
  const superAdminUser = await prisma.user.upsert({
    where: { email: 'superadmin@inventario.com' },
    update: {},
    create: {
      storeId: null, // Super admin no tiene tienda asignada
      personId: superAdminPerson.id,
      email: 'superadmin@inventario.com',
      passwordHash: superAdminPassword,
      role: UserRole.SUPERADMIN,
      status: EntityStatus.ACTIVE,
    },
  });
  console.log('Super administrador creado:', superAdminUser);

  // 4. Crear persona para el administrador de tienda
  console.log('Creando persona para el administrador de tienda...');
  const adminPerson = await prisma.person.upsert({
    where: { documentNumber: '12345678' },
    update: {},
    create: {
      documentType: DocumentType.DNI,
      documentNumber: '12345678',
      names: 'Administrador de Tienda',
      phone: '987654321',
      status: EntityStatus.ACTIVE,
    },
  });
  console.log('Persona administradora de tienda creada:', adminPerson);

  // 5. Crear administrador de tienda
  console.log('Creando administrador de tienda...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@inventario.com' },
    update: {},
    create: {
      storeId: store.id,
      personId: adminPerson.id,
      email: 'admin@inventario.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      status: EntityStatus.ACTIVE,
    },
  });
  console.log('Administrador de tienda creado:', adminUser);

  // 6. Crear persona para el vendedor
  console.log('Creando persona para el vendedor...');
  const sellerPerson = await prisma.person.upsert({
    where: { documentNumber: '87654321' },
    update: {},
    create: {
      documentType: DocumentType.DNI,
      documentNumber: '87654321',
      names: 'Carlos Vendedor',
      phone: '+51987654321',
      status: EntityStatus.ACTIVE,
    },
  });
  console.log('Persona vendedora creada:', sellerPerson);

  // 7. Crear vendedor
  console.log('Creando vendedor...');
  const sellerPassword = await bcrypt.hash('seller123', 10);
  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@inventario.com' },
    update: {},
    create: {
      storeId: store.id,
      personId: sellerPerson.id,
      email: 'seller@inventario.com',
      passwordHash: sellerPassword,
      role: UserRole.SELLER,
      status: EntityStatus.ACTIVE,
    },
  });
  console.log('Vendedor creado:', sellerUser);

  // 8. Crear categorías de productos
  console.log('Creando categorías de productos...');
  let category1 = await prisma.category.findFirst({
    where: { name: 'Electrónicos' },
  });
  if (!category1) {
    category1 = await prisma.category.create({
      data: {
        name: 'Electrónicos',
        description: 'Productos electrónicos y tecnológicos',
        status: EntityStatus.ACTIVE,
      },
    });
  }

  let category2 = await prisma.category.findFirst({
    where: { name: 'Oficina' },
  });
  if (!category2) {
    category2 = await prisma.category.create({
      data: {
        name: 'Oficina',
        description: 'Productos de oficina y papelería',
        status: EntityStatus.ACTIVE,
      },
    });
  }
  console.log('Categorías creadas:', { category1, category2 });

  // 9. Crear marcas de productos
  console.log('Creando marcas de productos...');
  let brand1 = await prisma.brand.findFirst({
    where: { name: 'Samsung' },
  });
  if (!brand1) {
    brand1 = await prisma.brand.create({
      data: {
        name: 'Samsung',
        status: EntityStatus.ACTIVE,
      },
    });
  }

  let brand2 = await prisma.brand.findFirst({
    where: { name: 'HP' },
  });
  if (!brand2) {
    brand2 = await prisma.brand.create({
      data: {
        name: 'HP',
        status: EntityStatus.ACTIVE,
      },
    });
  }
  console.log('Marcas creadas:', { brand1, brand2 });

  // 10. Crear productos de ejemplo
  console.log('Creando productos de ejemplo...');
  const product1 = await prisma.product.upsert({
    where: { sku: 'LAPTOP-SAMSUNG-001' },
    update: {},
    create: {
      storeId: store.id,
      sku: 'LAPTOP-SAMSUNG-001',
      name: 'Laptop Samsung Galaxy Book Pro',
      description: 'Laptop Samsung Galaxy Book Pro 15.6" con procesador Intel Core i7, 16GB RAM, 512GB SSD',
      purchasePrice: 1200.00,
      salePrice: 1500.00,
      currentStock: 10,
      minimumStock: 5,
      maximumStock: 50,
      unitOfMeasure: 'UNIT',
      imageUrl: 'https://example.com/images/laptop-samsung-001.jpg',
      categoryId: category1.id,
      brandId: brand1.id,
      isActive: true,
    },
  });

  const product2 = await prisma.product.upsert({
    where: { sku: 'LAPTOP-HP-001' },
    update: {},
    create: {
      storeId: store.id,
      sku: 'LAPTOP-HP-001',
      name: 'Laptop HP Pavilion 15',
      description: 'Laptop HP Pavilion 15.6" con procesador Intel Core i5, 8GB RAM, 256GB SSD',
      purchasePrice: 800.00,
      salePrice: 1000.00,
      currentStock: 15,
      minimumStock: 3,
      maximumStock: 30,
      unitOfMeasure: 'UNIT',
      imageUrl: 'https://example.com/images/laptop-hp-001.jpg',
      categoryId: category1.id,
      brandId: brand2.id,
      isActive: true,
    },
  });

  const product3 = await prisma.product.upsert({
    where: { sku: 'MOUSE-LOGI-001' },
    update: {},
    create: {
      storeId: store.id,
      sku: 'MOUSE-LOGI-001',
      name: 'Mouse Logitech MX Master 3',
      description: 'Mouse inalámbrico Logitech MX Master 3 con sensor de alta precisión',
      purchasePrice: 60.00,
      salePrice: 80.00,
      currentStock: 25,
      minimumStock: 10,
      maximumStock: 100,
      unitOfMeasure: 'UNIT',
      imageUrl: 'https://example.com/images/mouse-logitech-001.jpg',
      categoryId: category2.id,
      brandId: null, // Sin marca específica
      isActive: true,
    },
  });

  const product4 = await prisma.product.upsert({
    where: { sku: 'TECLADO-MEC-001' },
    update: {},
    create: {
      storeId: store.id,
      sku: 'TECLADO-MEC-001',
      name: 'Teclado Mecánico RGB',
      description: 'Teclado mecánico con retroiluminación RGB, switches azules',
      purchasePrice: 45.00,
      salePrice: 65.00,
      currentStock: 20,
      minimumStock: 5,
      maximumStock: 50,
      unitOfMeasure: 'UNIT',
      imageUrl: 'https://example.com/images/teclado-mecanico-001.jpg',
      categoryId: category2.id,
      brandId: null, // Sin marca específica
      isActive: true,
    },
  });

  console.log('Productos creados:', { product1, product2, product3, product4 });

  console.log('¡Semilla completada con éxito!');
}

main()
  .catch((e) => {
    console.error('Error durante la ejecución de la semilla:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
