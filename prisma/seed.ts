import { PrismaClient, DocumentType, EntityStatus, UserRole } from '@prisma/client';
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
      legalName: 'Tienda Principal E.I.R.L.',
      ruc: '20123456789',
      address: 'Av. Principal 123',
      email: 'info@tiendaprincipal.com',
      phone: '987654321',
      status: EntityStatus.ACTIVE,
    },
  });
  console.log('Tienda creada:', store);

  // 2. Crear persona para el usuario administrador
  console.log('Creando persona para el usuario administrador...');
  const adminPerson = await prisma.person.upsert({
    where: { documentNumber: '12345678' },
    update: {},
    create: {
      documentType: DocumentType.DNI,
      documentNumber: '12345678',
      names: 'Administrador',
      legalName: 'Administrador del Sistema',
      email: 'admin@inventario.com',
      phone: '999888777',
      address: 'Av. Principal 123',
      status: EntityStatus.ACTIVE,
    },
  });
  console.log('Persona administradora creada:', adminPerson);

  // 3. Crear usuario administrador
  console.log('Creando usuario administrador...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@inventario.com' },
    update: {},
    create: {
      storeId: store.id,
      personId: adminPerson.id,
      email: 'admin@inventario.com',
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
      status: EntityStatus.ACTIVE,
    },
  });
  console.log('Usuario administrador creado:', adminUser);

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
