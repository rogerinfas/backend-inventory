import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/infrastructure/database/prisma.service';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Customer with Person E2E', () => {
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
    await prismaService.customer.deleteMany();
    await prismaService.person.deleteMany();
    await prismaService.store.deleteMany();
    
    await app.close();
  });

  beforeEach(async () => {
    // Limpiar datos antes de cada prueba
    await prismaService.customer.deleteMany();
    await prismaService.person.deleteMany();
    await prismaService.store.deleteMany();
  });

  describe('POST /customers/with-person', () => {
    it('should create customer with person atomically', async () => {
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

      const createCustomerWithPersonDto = {
        // Datos de Person
        documentType: 'DNI',
        documentNumber: '12345678',
        names: 'Juan Carlos Pérez',
        email: 'juan@example.com',
        phone: '+51987654321',
        address: 'Av. Principal 123, Lima',
        // Datos de Customer
        storeId: store.id
      };

      const response = await request(app.getHttpServer())
        .post('/customers/with-person')
        .send(createCustomerWithPersonDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('personId');
      expect(response.body).toHaveProperty('person');
      expect(response.body.person.documentNumber).toBe('12345678');
      expect(response.body.person.names).toBe('Juan Carlos Pérez');
      expect(response.body.person.email).toBe('juan@example.com');
      expect(response.body.storeId).toBe(store.id);

      // Verificar que se creó en la base de datos
      const customer = await prismaService.customer.findUnique({
        where: { id: response.body.id },
        include: { person: true }
      });

      expect(customer).toBeTruthy();
      expect(customer.person.documentNumber).toBe('12345678');
      expect(customer.person.names).toBe('Juan Carlos Pérez');
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
          documentNumber: '87654321',
          names: 'Persona Existente',
          status: 'ACTIVE',
        },
      });

      const createCustomerWithPersonDto = {
        documentType: 'DNI',
        documentNumber: '87654321', // Mismo documento que la persona existente
        names: 'Nueva Persona',
        storeId: store.id
      };

      await request(app.getHttpServer())
        .post('/customers/with-person')
        .send(createCustomerWithPersonDto)
        .expect(409); // Conflict - persona ya existe

      // Verificar que no se creó ningún customer
      const customers = await prismaService.customer.findMany();
      expect(customers).toHaveLength(0);
    });

    it('should rollback if customer creation fails due to duplicate customer', async () => {
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
          documentNumber: '11111111',
          names: 'Persona Existente 2',
          status: 'ACTIVE',
        },
      });

      // Crear un customer existente para la misma tienda y persona
      await prismaService.customer.create({
        data: {
          id: 'existing-customer-id',
          storeId: store.id,
          personId: person.id,
          status: 'ACTIVE',
        },
      });

      const createCustomerWithPersonDto = {
        documentType: 'DNI',
        documentNumber: '11111111', // Mismo documento que la persona existente
        names: 'Persona Existente 2',
        storeId: store.id
      };

      await request(app.getHttpServer())
        .post('/customers/with-person')
        .send(createCustomerWithPersonDto)
        .expect(409); // Conflict - customer ya existe para esta tienda

      // Verificar que no se creó ningún customer adicional
      const customers = await prismaService.customer.findMany();
      expect(customers).toHaveLength(1);
      expect(customers[0].id).toBe('existing-customer-id');
    });

    it('should validate required fields', async () => {
      const invalidDto = {
        // Faltan campos requeridos
        documentType: 'DNI',
        // documentNumber faltante
        names: 'Juan Pérez',
        storeId: 'invalid-store-id'
      };

      await request(app.getHttpServer())
        .post('/customers/with-person')
        .send(invalidDto)
        .expect(400);
    });
  });
});
