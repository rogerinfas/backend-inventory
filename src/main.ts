import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './infrastructure/filters/global-exception.filter';
import { AdminInitializationService } from './application/services/admin-initialization.service';
import { StoreInitializationService } from './application/services/store-initialization.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar filtro global de errores
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Eliminar propiedades no definidas en DTOs
      forbidNonWhitelisted: true, // Lanzar error si hay propiedades no permitidas
      transform: true, // Transformar automáticamente los tipos
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configurar prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // Configurar CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // Frontend Next.js
      'http://localhost:3001',
      'http://localhost:5000', // Backend (por si acaso)
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Backend Inventory API')
    .setDescription('API para gestión de inventario con Clean Architecture')
    .setVersion('1.0')
    .addTag('auth', 'Autenticación')
    .addTag('users', 'Gestión de usuarios')
    .addTag('persons', 'Gestión de personas')
    .addTag('stores', 'Gestión de tiendas')
    .addTag('customers', 'Gestión de clientes')
    .addTag('suppliers', 'Gestión de proveedores')
    .addTag('sales', 'Gestión de ventas')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use('/api-reference', apiReference({
    content: document,
  }));

  // Inicializar administrador general
  const adminInitService = app.get(AdminInitializationService);
  await adminInitService.initializeGeneralAdmin();

  // Inicializar tienda de demostración
  const storeInitService = app.get(StoreInitializationService);
  await storeInitService.initializeDemoStore();

  await app.listen(process.env.PORT ?? 5000);
  console.log(`🚀 Aplicación ejecutándose en puerto ${process.env.PORT ?? 5000}`);
  console.log(`📚 Documentación API disponible en http://localhost:${process.env.PORT ?? 5000}/api`);
  console.log(`📚 Documentación API SCALAR disponible en http://localhost:${process.env.PORT ?? 5000}/api-reference`);
  console.log(`🔗 API Base URL: http://localhost:${process.env.PORT ?? 5000}/api`);
}
bootstrap();
