import { PrismaClient, DocumentType, EntityStatus, VoucherType, PurchaseStatus, SaleStatus, PurchaseDocumentType } from '@prisma/client';
import { UserRole } from '../src/domain/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Función para generar fechas aleatorias
function getRandomDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * days));
  return date;
}

// Datos de prueba realistas
const SUPPLIERS = [
  {
    person: {
      documentType: DocumentType.RUC,
      documentNumber: '20123456789',
      names: 'TecnoImport S.A.C.',
      phone: '012345678',
      status: EntityStatus.ACTIVE,
    },
    businessName: 'TecnoImport S.A.C.',
    ruc: '20123456789',
    address: 'Av. Arequipa 123, Lima',
    phone: '012345678'
  },
  {
    person: {
      documentType: DocumentType.RUC,
      documentNumber: '20234567890',
      names: 'DistriTecno E.I.R.L.',
      phone: '023456789',
      status: EntityStatus.ACTIVE,
    },
    businessName: 'DistriTecno E.I.R.L.',
    ruc: '20234567890',
    address: 'Av. Javier Prado 456, San Isidro',
    phone: '023456789'
  },
  {
    person: {
      documentType: DocumentType.RUC,
      documentNumber: '20345678901',
      names: 'ElectroSuministros S.A.',
      phone: '034567890',
      status: EntityStatus.ACTIVE,
    },
    businessName: 'ElectroSuministros S.A.',
    ruc: '20345678901',
    address: 'Av. La Marina 789, San Miguel',
    phone: '034567890'
  }
];

const CUSTOMERS = [
  {
    person: {
      documentType: DocumentType.DNI,
      documentNumber: '71234567',
      names: 'Juan Pérez García',
      phone: '987654321',
      status: EntityStatus.ACTIVE,
    },
    email: 'juan.perez@email.com'
  },
  {
    person: {
      documentType: DocumentType.DNI,
      documentNumber: '72345678',
      names: 'María Rodríguez López',
      phone: '987654322',
      status: EntityStatus.ACTIVE,
    },
    email: 'maria.rl@email.com'
  },
  {
    person: {
      documentType: DocumentType.CE,
      documentNumber: 'X12345678',
      names: 'Carlos Gutiérrez Torres',
      phone: '987654323',
      status: EntityStatus.ACTIVE,
    },
    email: 'carlos.gt@email.com'
  },
  {
    person: {
      documentType: DocumentType.DNI,
      documentNumber: '74567890',
      names: 'Ana Mendoza Vargas',
      phone: '987654324',
      status: EntityStatus.ACTIVE,
    },
    email: 'ana.mv@email.com'
  },
  {
    person: {
      documentType: DocumentType.RUC,
      documentNumber: '10456789011',
      names: 'InnovaTech E.I.R.L.',
      phone: '987654325',
      status: EntityStatus.ACTIVE,
    },
    email: 'contacto@innovatech.com'
  },
  {
    person: {
      documentType: DocumentType.RUC,
      documentNumber: '10567890121',
      names: 'Soluciones Digitales S.A.C.',
      phone: '987654326',
      status: EntityStatus.ACTIVE,
    },
    email: 'info@soldigital.com'
  }
];

const PRODUCTS = [
  {
    sku: 'LAP-DELL-001',
    name: 'Laptop Dell XPS 13',
    description: 'Laptop 13.4" FHD+, Intel Core i7, 16GB RAM, 512GB SSD',
    purchasePrice: 3200.00,
    salePrice: 3899.00,
    currentStock: 15,
    minimumStock: 5,
    maximumStock: 30,
    unitOfMeasure: 'UNIT',
    imageUrl: 'https://example.com/images/laptop-dell-xps13.jpg',
    category: 'Laptops',
    brand: 'Dell'
  },
  {
    sku: 'TEL-SAMS-001',
    name: 'Smartphone Samsung Galaxy S23',
    description: '6.1" Dynamic AMOLED, 128GB, 8GB RAM, Cámara 50MP',
    purchasePrice: 2500.00,
    salePrice: 2999.00,
    currentStock: 25,
    minimumStock: 10,
    maximumStock: 50,
    unitOfMeasure: 'UNIT',
    imageUrl: 'https://example.com/images/samsung-s23.jpg',
    category: 'Celulares',
    brand: 'Samsung'
  },
  {
    sku: 'TAB-IPAD-001',
    name: 'Tablet Apple iPad Air',
    description: '10.9" Liquid Retina, 64GB, Wi-Fi, Chip M1',
    purchasePrice: 2800.00,
    salePrice: 3499.00,
    currentStock: 12,
    minimumStock: 5,
    maximumStock: 25,
    unitOfMeasure: 'UNIT',
    imageUrl: 'https://example.com/images/ipad-air.jpg',
    category: 'Tablets',
    brand: 'Apple'
  },
  {
    sku: 'AUR-SONY-001',
    name: 'Audífonos Sony WH-1000XM5',
    description: 'Audífonos inalámbricos con cancelación de ruido',
    purchasePrice: 1200.00,
    salePrice: 1599.00,
    currentStock: 20,
    minimumStock: 5,
    maximumStock: 40,
    unitOfMeasure: 'UNIT',
    imageUrl: 'https://example.com/images/sony-wh1000xm5.jpg',
    category: 'Audio',
    brand: 'Sony'
  },
  {
    sku: 'MON-LG-001',
    name: 'Monitor LG 27UL500',
    description: 'Monitor 27" 4K UHD, HDR10, FreeSync',
    purchasePrice: 1200.00,
    salePrice: 1499.00,
    currentStock: 8,
    minimumStock: 3,
    maximumStock: 15,
    unitOfMeasure: 'UNIT',
    imageUrl: 'https://example.com/images/lg-27ul500.jpg',
    category: 'Monitores',
    brand: 'LG'
  },
  {
    sku: 'TEC-LOGI-001',
    name: 'Teclado Logitech MX Keys',
    description: 'Teclado inalámbrico con retroiluminación',
    purchasePrice: 280.00,
    salePrice: 399.00,
    currentStock: 18,
    minimumStock: 5,
    maximumStock: 30,
    unitOfMeasure: 'UNIT',
    imageUrl: 'https://example.com/images/logitech-mx-keys.jpg',
    category: 'Periféricos',
    brand: 'Logitech'
  },
  {
    sku: 'MOUSE-LOGI-001',
    name: 'Mouse Logitech MX Master 3S',
    description: 'Mouse inalámbrico ergonómico para productividad',
    purchasePrice: 320.00,
    salePrice: 459.00,
    currentStock: 22,
    minimumStock: 5,
    maximumStock: 40,
    unitOfMeasure: 'UNIT',
    imageUrl: 'https://example.com/images/logitech-mx-master.jpg',
    category: 'Periféricos',
    brand: 'Logitech'
  },
  {
    sku: 'SSD-SAMS-001',
    name: 'Disco SSD Samsung 1TB',
    description: 'SSD 1TB NVMe M.2 970 EVO Plus',
    purchasePrice: 380.00,
    salePrice: 499.00,
    currentStock: 30,
    minimumStock: 10,
    maximumStock: 50,
    unitOfMeasure: 'UNIT',
    imageUrl: 'https://example.com/images/ssd-samsung.jpg',
    category: 'Almacenamiento',
    brand: 'Samsung'
  },
  {
    sku: 'MEM-COR-001',
    name: 'Memoria RAM Corsair 16GB',
    description: 'Kit 16GB (2x8GB) DDR4 3200MHz',
    purchasePrice: 220.00,
    salePrice: 299.00,
    currentStock: 25,
    minimumStock: 10,
    maximumStock: 50,
    unitOfMeasure: 'KIT',
    imageUrl: 'https://example.com/images/ram-corsair.jpg',
    category: 'Memorias',
    brand: 'Corsair'
  },
  {
    sku: 'BAT-ANK-001',
    name: 'Batería Externa Anker 20000mAh',
    description: 'Batería portátil con carga rápida 20W',
    purchasePrice: 120.00,
    salePrice: 199.00,
    currentStock: 35,
    minimumStock: 10,
    maximumStock: 60,
    unitOfMeasure: 'UNIT',
    imageUrl: 'https://example.com/images/anker-powerbank.jpg',
    category: 'Accesorios',
    brand: 'Anker'
  },
  {
    sku: 'CAM-LOGI-001',
    name: 'Webcam Logitech C920',
    description: 'Webcam Full HD 1080p con micrófono estéreo',
    purchasePrice: 280.00,
    salePrice: 399.00,
    currentStock: 15,
    minimumStock: 5,
    maximumStock: 30,
    unitOfMeasure: 'UNIT',
    imageUrl: 'https://example.com/images/logitech-c920.jpg',
    category: 'Cámaras',
    brand: 'Logitech'
  },
  {
    sku: 'IMP-HP-001',
    name: 'Impresora HP LaserJet Pro',
    description: 'Impresora láser multifunción a color',
    purchasePrice: 1200.00,
    salePrice: 1599.00,
    currentStock: 6,
    minimumStock: 2,
    maximumStock: 10,
    unitOfMeasure: 'UNIT',
    imageUrl: 'https://example.com/images/hp-laserjet.jpg',
    category: 'Impresoras',
    brand: 'HP'
  }
];

async function main() {
  console.log('Iniciando el proceso de semilla...');

  // 1. Crear tienda de prueba
  console.log('Creando tienda de prueba...');
  const store = await prisma.store.upsert({
    where: { ruc: '20123456789' },
    update: {},
    create: {
      businessName: 'TecnoStore Perú E.I.R.L.',
      ruc: '20123456789',
      address: 'Av. Aviación 1234, San Isidro',
      phone: '014400123',
      status: EntityStatus.ACTIVE,
    },
  });
  console.log('Tienda creada:', store);

  // 2. Crear categorías y marcas
  console.log('Creando categorías y marcas...');
  const categories: Record<string, {id: string}> = {};
  const brands: Record<string, {id: string}> = {};
  
  // Obtener categorías y marcas únicas de los productos
  const uniqueCategories = [...new Set(PRODUCTS.map(p => p.category))];
  const uniqueBrands = [...new Set(PRODUCTS.map(p => p.brand).filter((b): b is string => Boolean(b)))];
  
  // Crear categorías
  for (const categoryName of uniqueCategories) {
    // Primero intentamos encontrar la categoría por nombre
    const existingCategory = await prisma.category.findFirst({
      where: { name: categoryName }
    });
    
    const category = existingCategory || await prisma.category.create({
      data: {
        name: categoryName,
        description: `Categoría de ${categoryName}`,
        status: EntityStatus.ACTIVE,
      },
    });
    categories[categoryName] = category;
  }
  
  // Crear marcas
  for (const brandName of uniqueBrands) {
    // Primero intentamos encontrar la marca por nombre
    const existingBrand = await prisma.brand.findFirst({
      where: { name: brandName }
    });
    
    const brand = existingBrand || await prisma.brand.create({
      data: {
        name: brandName,
        status: EntityStatus.ACTIVE,
      },
    });
    brands[brandName] = brand;
  }
  
  // 3. Crear productos
  console.log('Creando productos...');
  const createdProducts: any[] = [];
  for (const productData of PRODUCTS) {
    // Primero intentamos encontrar el producto por SKU
    const existingProduct = await prisma.product.findUnique({
      where: { sku: productData.sku }
    });
    
    if (!existingProduct) {
      const product = await prisma.product.create({
        data: {
          storeId: store.id,
          sku: productData.sku,
          name: productData.name,
          description: productData.description,
          purchasePrice: productData.purchasePrice,
          salePrice: productData.salePrice,
          currentStock: productData.currentStock,
          minimumStock: productData.minimumStock,
          maximumStock: productData.maximumStock || 100,
          unitOfMeasure: productData.unitOfMeasure as any, // Usamos 'as any' temporalmente
          imageUrl: productData.imageUrl,
          categoryId: categories[productData.category]?.id || null,
          brandId: productData.brand ? brands[productData.brand]?.id || null : null,
          isActive: true,
        },
      });
      createdProducts.push(product);
    } else {
      createdProducts.push(existingProduct);
    }
  }
  console.log(`Se procesaron ${createdProducts.length} productos`);
  
  // 4. Crear proveedores
  console.log('Creando proveedores...');
  const createdSuppliers: any[] = [];
  for (const supplierData of SUPPLIERS) {
    // Verificar si la persona ya existe
    let person = await prisma.person.findUnique({
      where: { documentNumber: supplierData.person.documentNumber }
    });
    
    // Si no existe, la creamos
    if (!person) {
      person = await prisma.person.create({
        data: supplierData.person
      });
    }
    
    // Verificar si el proveedor ya existe
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        storeId: store.id,
        personId: person.id
      }
    });
    
    // Si no existe, lo creamos
    if (!existingSupplier) {
      const supplier = await prisma.supplier.create({
        data: {
          storeId: store.id,
          personId: person.id,
          status: EntityStatus.ACTIVE,
        },
        include: { person: true },
      });
      createdSuppliers.push(supplier);
    } else {
      createdSuppliers.push(existingSupplier);
    }
  }
  console.log(`Se procesaron ${createdSuppliers.length} proveedores`);
  
  // 5. Crear clientes
  console.log('Creando clientes...');
  const createdCustomers: any[] = [];
  for (const customerData of CUSTOMERS) {
    // Verificar si la persona ya existe
    let person = await prisma.person.findUnique({
      where: { documentNumber: customerData.person.documentNumber }
    });
    
    // Si no existe, la creamos
    if (!person) {
      person = await prisma.person.create({
        data: customerData.person
      });
    }
    
    // Verificar si el cliente ya existe
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        storeId: store.id,
        personId: person.id
      }
    });
    
    // Si no existe, lo creamos
    let customer;
    if (!existingCustomer) {
      customer = await prisma.customer.create({
        data: {
          storeId: store.id,
          personId: person.id,
          status: EntityStatus.ACTIVE,
        },
        include: { person: true },
      });
    } else {
      customer = existingCustomer;
    }
    
    // Crear usuario si es necesario (solo para clientes con email)
    if (customerData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: customerData.email }
      });
      
      if (!existingUser) {
        const password = await bcrypt.hash('cliente123', 10);
        await prisma.user.create({
          data: {
            storeId: store.id,
            personId: person.id,
            email: customerData.email,
            passwordHash: password,
            role: UserRole.SELLER, // Rol de vendedor para clientes
      status: EntityStatus.ACTIVE,
    },
  });
      }
    }
    
    createdCustomers.push(customer);
  }
  console.log(`Se procesaron ${createdCustomers.length} clientes`);

  // 6. Crear usuario vendedor si no existe
  console.log('Creando usuario vendedor...');
  const sellerUser = await prisma.user.upsert({
    where: { email: 'vendedor@tienda.com' },
    update: {},
    create: {
      storeId: store.id,
      personId: createdCustomers[0].personId, // Usamos el ID de la primera persona cliente
      email: 'vendedor@tienda.com',
      passwordHash: await bcrypt.hash('vendedor123', 10),
      role: UserRole.SELLER,
      status: EntityStatus.ACTIVE,
    },
  });
  console.log('Usuario vendedor creado:', sellerUser);

  // 7. Crear compras de ejemplo
  console.log('Creando compras de ejemplo...');
  const purchase1 = await prisma.purchase.create({
    data: {
      storeId: store.id,
      supplierId: createdSuppliers[0].id,
      userId: sellerUser.id,
      documentNumber: 'F001-00000001',
      documentType: PurchaseDocumentType.INVOICE,
      purchaseDate: new Date('2025-10-20'),
      subtotal: 12000.00,
      tax: 2160.00,
      total: 14160.00,
      status: PurchaseStatus.RECEIVED,
      notes: 'Pedido de reposición de inventario',
      details: {
        create: [
          {
            productId: createdProducts[0].id,
            quantity: 5,
            unitPrice: 1200.00,
            discount: 0,
          },
          {
            productId: createdProducts[1].id,
            quantity: 10,
            unitPrice: 800.00,
            discount: 0,
          },
        ],
      },
    },
    include: { details: true },
  });
  
  console.log('Compra 1 creada:', purchase1);

  // Crear segunda compra
  const purchase2 = await prisma.purchase.create({
    data: {
      storeId: store.id,
      supplierId: createdSuppliers[1].id,
      userId: sellerUser.id,
      documentNumber: 'F001-00000002',
      documentType: PurchaseDocumentType.INVOICE,
      purchaseDate: new Date('2025-10-21'),
      subtotal: 8500.00,
      tax: 1530.00,
      total: 10030.00,
      status: PurchaseStatus.RECEIVED,
      notes: 'Compra de equipos de oficina',
      details: {
        create: [
          {
            productId: createdProducts[2].id, // Tablet iPad
            quantity: 3,
            unitPrice: 2800.00,
            discount: 0,
          },
          {
            productId: createdProducts[6].id, // Mouse Logitech
            quantity: 5,
            unitPrice: 320.00,
            discount: 100.00,
          },
          {
            productId: createdProducts[7].id, // SSD Samsung
            quantity: 4,
            unitPrice: 380.00,
            discount: 0,
          },
        ],
      },
    },
    include: { details: true },
  });
  
  console.log('Compra 2 creada:', purchase2);

  // 7. Crear ventas de ejemplo
  console.log('Creando ventas de ejemplo...');
  const sale1 = await prisma.sale.create({
    data: {
      storeId: store.id,
      customerId: createdCustomers[0].id,
      userId: sellerUser.id,
      documentNumber: 'B001-00000001',
      documentType: VoucherType.RECEIPT,
      series: 'B001',
      saleDate: new Date('2025-10-22'),
      subtotal: 4500.00,
      tax: 810.00,
      total: 5310.00,
      status: SaleStatus.COMPLETED,
      details: {
        create: [
          {
            productId: createdProducts[0].id,
            quantity: 1,
            unitPrice: 3899.00,
            discount: 0,
          },
          {
            productId: createdProducts[3].id,
            quantity: 1,
            unitPrice: 80.00,
            discount: 0,
          },
          {
            productId: createdProducts[4].id,
            quantity: 1,
            unitPrice: 65.00,
            discount: 5.00,
          },
        ],
      },
    },
    include: { details: true },
  });
  
  console.log('Venta 1 creada:', sale1);

  // Crear segunda venta
  const sale2 = await prisma.sale.create({
    data: {
      storeId: store.id,
      customerId: createdCustomers[1].id,
      userId: sellerUser.id,
      documentNumber: 'F001-00000001',
      documentType: VoucherType.INVOICE,
      series: 'F001',
      saleDate: new Date('2025-10-23'),
      subtotal: 3200.00,
      tax: 576.00,
      total: 3776.00,
      status: SaleStatus.COMPLETED,
      notes: 'Venta de laptop para empresa',
      details: {
        create: [
          {
            productId: createdProducts[0].id, // Laptop Dell
            quantity: 1,
            unitPrice: 3200.00,
            discount: 0,
          },
        ],
      },
    },
    include: { details: true },
  });
  
  console.log('Venta 2 creada:', sale2);

  // Crear tercera venta
  const sale3 = await prisma.sale.create({
    data: {
      storeId: store.id,
      customerId: createdCustomers[0].id,
      userId: sellerUser.id,
      documentNumber: 'B001-00000002',
      documentType: VoucherType.RECEIPT,
      series: 'B001',
      saleDate: new Date('2025-10-24'),
      subtotal: 1998.00,
      tax: 359.64,
      total: 2357.64,
      status: SaleStatus.COMPLETED,
      notes: 'Venta de accesorios',
      details: {
        create: [
          {
            productId: createdProducts[5].id, // Teclado Logitech
            quantity: 1,
            unitPrice: 399.00,
            discount: 0,
          },
          {
            productId: createdProducts[6].id, // Mouse Logitech
            quantity: 1,
            unitPrice: 459.00,
            discount: 0,
          },
          {
            productId: createdProducts[8].id, // Memoria RAM
            quantity: 2,
            unitPrice: 299.00,
            discount: 0,
          },
          {
            productId: createdProducts[9].id, // Batería Externa
            quantity: 1,
            unitPrice: 199.00,
            discount: 0,
          },
        ],
      },
    },
    include: { details: true },
  });
  
  console.log('Venta 3 creada:', sale3);

  // Crear cuarta venta
  const sale4 = await prisma.sale.create({
    data: {
      storeId: store.id,
      customerId: createdCustomers[1].id,
      userId: sellerUser.id,
      documentNumber: 'B001-00000003',
      documentType: VoucherType.RECEIPT,
      series: 'B001',
      saleDate: new Date('2025-10-24'),
      subtotal: 5097.00,
      tax: 917.46,
      total: 6014.46,
      status: SaleStatus.PENDING,
      notes: 'Venta pendiente de pago',
      details: {
        create: [
          {
            productId: createdProducts[1].id, // Smartphone Samsung
            quantity: 1,
            unitPrice: 2999.00,
            discount: 0,
          },
          {
            productId: createdProducts[3].id, // Audífonos Sony
            quantity: 1,
            unitPrice: 1599.00,
            discount: 0,
          },
          {
            productId: createdProducts[10].id, // Webcam Logitech
            quantity: 1,
            unitPrice: 399.00,
            discount: 0,
          },
        ],
      },
    },
    include: { details: true },
  });
  
  console.log('Venta 4 creada:', sale4);

  // 8. Actualizar stock de productos después de compras y ventas
  console.log('Actualizando stock de productos...');
  
  // Actualizar stock basado en compras y ventas
  await prisma.product.update({
    where: { id: createdProducts[0].id }, // Laptop Dell
    data: { 
      currentStock: createdProducts[0].currentStock + 5 - 2, // +5 compra1, -1 venta1, -1 venta2
    },
  });
  
  await prisma.product.update({
    where: { id: createdProducts[1].id }, // Smartphone Samsung
    data: { 
      currentStock: createdProducts[1].currentStock + 10 - 1, // +10 compra1, -1 venta4
    },
  });
  
  await prisma.product.update({
    where: { id: createdProducts[2].id }, // Tablet iPad
    data: { 
      currentStock: createdProducts[2].currentStock + 3, // +3 compra2
    },
  });
  
  await prisma.product.update({
    where: { id: createdProducts[3].id }, // Audífonos Sony
    data: { 
      currentStock: createdProducts[3].currentStock - 2, // -1 venta1, -1 venta4
    },
  });
  
  await prisma.product.update({
    where: { id: createdProducts[4].id }, // Monitor LG
    data: { 
      currentStock: createdProducts[4].currentStock - 1, // -1 venta1
    },
  });
  
  await prisma.product.update({
    where: { id: createdProducts[5].id }, // Teclado Logitech
    data: { 
      currentStock: createdProducts[5].currentStock - 1, // -1 venta3
    },
  });
  
  await prisma.product.update({
    where: { id: createdProducts[6].id }, // Mouse Logitech
    data: { 
      currentStock: createdProducts[6].currentStock + 5 - 1, // +5 compra2, -1 venta3
    },
  });
  
  await prisma.product.update({
    where: { id: createdProducts[7].id }, // SSD Samsung
    data: { 
      currentStock: createdProducts[7].currentStock + 4, // +4 compra2
    },
  });
  
  await prisma.product.update({
    where: { id: createdProducts[8].id }, // Memoria RAM
    data: { 
      currentStock: createdProducts[8].currentStock - 2, // -2 venta3
    },
  });
  
  await prisma.product.update({
    where: { id: createdProducts[9].id }, // Batería Externa
    data: { 
      currentStock: createdProducts[9].currentStock - 1, // -1 venta3
    },
  });
  
  await prisma.product.update({
    where: { id: createdProducts[10].id }, // Webcam Logitech
    data: { 
      currentStock: createdProducts[10].currentStock - 1, // -1 venta4
    },
  });

  console.log('¡Semilla completada con éxito!');
  console.log('--- Resumen ---');
  console.log(`- Tienda: ${store.businessName}`);
  console.log(`- Productos: ${createdProducts.length}`);
  console.log(`- Proveedores: ${createdSuppliers.length}`);
  console.log(`- Clientes: ${createdCustomers.length}`);
  console.log(`- Compras: 2`);
  console.log(`- Ventas: 4`);
  console.log('--- Credenciales ---');
  console.log('Super Admin: superadmin@inventario.com / superadmin123');
  console.log('Admin: admin@inventario.com / admin123');
  console.log('Vendedor: seller@inventario.com / seller123');
  console.log('Cliente de ejemplo: juan.perez@email.com / cliente123');
}

main()
  .catch((e) => {
    console.error('Error durante la ejecución de la semilla:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
