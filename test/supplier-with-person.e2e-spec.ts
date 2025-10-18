import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/infrastructure/database/prisma.service';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Supplier with Person E2E', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    
    await app.init();
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    await prismaService.supplier.deleteMany();
    await prismaService.person.deleteMany();
    await prismaService.store.deleteMany();
    
    await app.close();
  });

  beforeEach(async () => {
    // Limpiar datos antes de cada prueba
    await prismaService.supplier.deleteMany();
    await prismaService.person.deleteMany();
    await prismaService.store.deleteMany();
  });

  describe('POST /suppliers/with-person', () => {
    it('should create supplier with person atomically', async () => {
      // Primero crear una tienda para la prueba
      const store = await prismaService.store.create({
        data: {
          id: 'test-store-id',
          name: 'Tienda de Prueba',
          address: 'Dirección de Prueba',
          phone: '+51987654321',
          email: 'tienda@test.com',
          status: 'ACTIVE',
        },
      });

      const createSupplierWithPersonDto = {
        // Datos de Person
        documentType: 'DNI',
        documentNumber: '87654321',
        names: 'María González López',
        email: 'maria@example.com',
        phone: '+51987654322',
        address: 'Av. Comercial 456, Lima',
        // Datos de Supplier
        storeId: store.id
      };

      const response = await request(app.getHttpServer())
        .post('/suppliers/with-person')
        .send(createSupplierWithPersonDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('personId');
      expect(response.body).toHaveProperty('person');
      expect(response.body.person.documentNumber).toBe('87654321');
      expect(response.body.person.names).toBe('María González López');
      expect(response.body.person.email).toBe('maria@example.com');
      expect(response.body.storeId).toBe(store.id);

      // Verificar que se creó en la base de datos
      const supplier = await prismaService.supplier.findUnique({
        where: { id: response.body.id },
        include: { person: true }
      });

      expect(supplier).toBeTruthy();
      expect(supplier.person.documentNumber).toBe('87654321');
      expect(supplier.person.names).toBe('María González López');
    });

    it('should rollback if person creation fails due to duplicate document', async () => {
      // Crear una tienda
      const store = await prismaService.store.create({
        data: {
          id: 'test-store-id-2',
          name: 'Tienda de Prueba 2',
          address: 'Dirección de Prueba 2',
          phone: '+51987654322',
          email: 'tienda2@test.com',
          status: 'ACTIVE',
        },
      });

      // Crear una persona existente con el mismo documento
      await prismaService.person.create({
        data: {
          id: 'existing-person-id',
          documentType: 'DNI',
          documentNumber: '99999999',
          names: 'Persona Existente',
          status: 'ACTIVE',
        },
      });

      const createSupplierWithPersonDto = {
        documentType: 'DNI',
        documentNumber: '99999999', // Mismo documento que la persona existente
        names: 'Nueva Persona',
        storeId: store.id
      };

      await request(app.getHttpServer())
        .post('/suppliers/with-person')
        .send(createSupplierWithPersonDto)
        .expect(409); // Conflict - persona ya existe

      // Verificar que no se creó ningún supplier
      const suppliers = await prismaService.supplier.findMany();
      expect(suppliers).toHaveLength(0);
    });

    it('should rollback if supplier creation fails due to duplicate supplier', async () => {
      // Crear una tienda
      const store = await prismaService.store.create({
        data: {
          id: 'test-store-id-3',
          name: 'Tienda de Prueba 3',
          address: 'Dirección de Prueba 3',
          phone: '+51987654323',
          email: 'tienda3@test.com',
          status: 'ACTIVE',
        },
      });

      // Crear una persona existente
      const person = await prismaService.person.create({
        data: {
          id: 'existing-person-id-2',
          documentType: 'DNI',
          documentNumber: '22222222',
          names: 'Persona Existente 2',
          status: 'ACTIVE',
        },
      });

      // Crear un supplier existente para la misma tienda y persona
      await prismaService.supplier.create({
        data: {
          id: 'existing-supplier-id',
          storeId: store.id,
          personId: person.id,
          status: 'ACTIVE',
        },
      });

      const createSupplierWithPersonDto = {
        documentType: 'DNI',
        documentNumber: '22222222', // Mismo documento que la persona existente
        names: 'Persona Existente 2',
        storeId: store.id
      };

      await request(app.getHttpServer())
        .post('/suppliers/with-person')
        .send(createSupplierWithPersonDto)
        .expect(409); // Conflict - supplier ya existe para esta tienda

      // Verificar que no se creó ningún supplier adicional
      const suppliers = await prismaService.supplier.findMany();
      expect(suppliers).toHaveLength(1);
      expect(suppliers[0].id).toBe('existing-supplier-id');
    });

    it('should validate required fields', async () => {
      const invalidDto = {
        // Faltan campos requeridos
        documentType: 'DNI',
        // documentNumber faltante
        names: 'María González',
        storeId: 'invalid-store-id'
      };

      await request(app.getHttpServer())
        .post('/suppliers/with-person')
        .send(invalidDto)
        .expect(400);
    });
  });
});
