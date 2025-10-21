import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  console.log('🧹 Limpiando datos existentes...');
  await prisma.saleDetail.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.purchaseDetail.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.voucherSeries.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.person.deleteMany();
  await prisma.store.deleteMany();
  console.log('✅ Datos existentes eliminados');

  // 1. Crear Store
  console.log('📦 Creando tienda...');
  const store = await prisma.store.create({
    data: {
      businessName: 'TechStore Perú',
      ruc: '20123456789',
      legalName: 'TechStore Perú S.A.C.',
      address: 'Av. Principal 123, Lima, Perú',
      phone: '+51 1 234 5678',
      email: 'ventas@techstore.pe',
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Tienda creada: ${store.businessName} (ID: ${store.id})`);

  // 2. Crear Personas
  console.log('👥 Creando personas...');
  
  // Persona para Customer
  const customerPerson = await prisma.person.create({
    data: {
      documentType: 'DNI',
      documentNumber: '12345678',
      names: 'Juan Carlos Pérez',
      address: 'Jr. Los Olivos 456, Lima',
      phone: '+51 987 654 321',
      email: 'juan.perez@email.com',
      status: 'ACTIVE',
    },
  });

  // Persona para User
  const userPerson = await prisma.person.create({
    data: {
      documentType: 'DNI',
      documentNumber: '87654321',
      names: 'María García López',
      address: 'Av. Miraflores 789, Lima',
      phone: '+51 987 123 456',
      email: 'maria.garcia@techstore.pe',
      status: 'ACTIVE',
    },
  });

  // Persona para Supplier
  const supplierPerson = await prisma.person.create({
    data: {
      documentType: 'RUC',
      documentNumber: '20123456789',
      names: 'Carlos Mendoza',
      legalName: 'Distribuidora de Tecnología S.A.C.',
      address: 'Av. Industrial 321, Lima',
      phone: '+51 1 456 7890',
      email: 'ventas@distribuidora.pe',
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Personas creadas: ${customerPerson.names}, ${userPerson.names}, ${supplierPerson.names}`);

  // 3. Crear Customer
  console.log('🛒 Creando cliente...');
  const customer = await prisma.customer.create({
    data: {
      storeId: store.id,
      personId: customerPerson.id,
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Cliente creado: ${customerPerson.names} (ID: ${customer.id})`);

  // 4. Crear User
  console.log('👤 Creando usuario...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      storeId: store.id,
      personId: userPerson.id,
      email: userPerson.email || 'maria.garcia@techstore.pe',
      passwordHash: hashedPassword,
      role: 'SELLER',
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Usuario creado: ${userPerson.names} (Email: ${user.email})`);

  // 5. Crear Supplier
  console.log('🏭 Creando proveedor...');
  const supplier = await prisma.supplier.create({
    data: {
      storeId: store.id,
      personId: supplierPerson.id,
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Proveedor creado: ${supplierPerson.names} (ID: ${supplier.id})`);

  // 6. Crear Category
  console.log('📂 Creando categoría...');
  const category = await prisma.category.create({
    data: {
      name: 'Computadoras',
      description: 'Laptops, desktops y accesorios de computación',
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Categoría creada: ${category.name} (ID: ${category.id})`);

  // 7. Crear Brand
  console.log('🏷️ Creando marca...');
  const brand = await prisma.brand.create({
    data: {
      name: 'TechBrand',
      status: 'ACTIVE',
    },
  });
  console.log(`✅ Marca creada: ${brand.name} (ID: ${brand.id})`);

  // 8. Crear Productos
  console.log('📱 Creando productos...');
  
  const products = await Promise.all([
    prisma.product.create({
      data: {
        storeId: store.id,
        categoryId: category.id,
        brandId: brand.id,
        sku: 'LAPTOP-001',
        name: 'Laptop Gaming Pro',
        description: 'Laptop para gaming de alta gama',
        purchasePrice: 2500.00,
        salePrice: 3200.00,
        currentStock: 0,
        reservedStock: 0,
        minimumStock: 2,
        maximumStock: 10,
        unitOfMeasure: 'UNIT',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        storeId: store.id,
        categoryId: category.id,
        brandId: brand.id,
        sku: 'LAPTOP-002',
        name: 'Laptop Office',
        description: 'Laptop para oficina y trabajo',
        purchasePrice: 1200.00,
        salePrice: 1500.00,
        currentStock: 5,
        reservedStock: 0,
        minimumStock: 3,
        maximumStock: 15,
        unitOfMeasure: 'UNIT',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        storeId: store.id,
        categoryId: category.id,
        brandId: brand.id,
        sku: 'LAPTOP-003',
        name: 'Laptop Student',
        description: 'Laptop económica para estudiantes',
        purchasePrice: 800.00,
        salePrice: 1000.00,
        currentStock: 15,
        reservedStock: 0,
        minimumStock: 5,
        maximumStock: 25,
        unitOfMeasure: 'UNIT',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Productos creados:`);
  products.forEach((product, index) => {
    console.log(`   ${index + 1}. ${product.name} - Stock: ${product.currentStock}`);
  });

  // 9. Crear VoucherSeries
  console.log('🎫 Creando series de comprobantes...');
  const voucherSeries = await prisma.voucherSeries.create({
    data: {
      storeId: store.id,
      voucherType: 'RECEIPT',
      series: 'B001',
      currentNumber: 1,
    },
  });
  console.log(`✅ Serie de comprobantes creada: ${voucherSeries.series}`);

  console.log('🎉 Seed completado exitosamente!');
  console.log('\n📊 Resumen de datos creados:');
  console.log(`- Tienda: ${store.businessName}`);
  console.log(`- Cliente: ${customerPerson.names}`);
  console.log(`- Usuario: ${userPerson.names} (${user.email})`);
  console.log(`- Proveedor: ${supplierPerson.names}`);
  console.log(`- Productos: ${products.length} (Stock: 0, 5, 15)`);
  console.log(`- Categoría: ${category.name}`);
  console.log(`- Marca: ${brand.name}`);
  console.log(`- Serie: ${voucherSeries.series}`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
