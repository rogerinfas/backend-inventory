import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './infrastructure/filters/global-exception.filter';

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

  // Configurar CORS
  app.enableCors();

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Backend Inventory API')
    .setDescription('API para gestión de inventario con Clean Architecture')
    .setVersion('1.0')
    .addTag('persons', 'Gestión de personas')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use('/api-reference', apiReference({
    content:document,
  }));

  await app.listen(process.env.PORT ?? 9987);
  console.log(`🚀 Aplicación ejecutándose en puerto ${process.env.PORT ?? 9987}`);
  console.log(`📚 Documentación API disponible en http://localhost:${process.env.PORT ?? 9987}/api`);
  console.log(`📚 Documentación API SCALAR disponible en http://localhost:${process.env.PORT ?? 9987}/api-reference`);
}
bootstrap();
