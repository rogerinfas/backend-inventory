<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
# Instalar dependencias
$ pnpm install

# Copiar archivo de entorno de ejemplo
$ cp .env.example .env

# Configurar las variables de entorno en .env
# Especialmente DATABASE_URL para tu entorno local
```

## Configuración de la Base de Datos

### Requisitos Previos
- Docker y Docker Compose instalados
- Node.js 16+ y pnpm

### Iniciar la base de datos con Docker

```bash
# Iniciar la base de datos PostgreSQL
$ docker-compose up -d

# Verificar que el contenedor está en ejecución
$ docker ps
```

### Migraciones de Base de Datos

```bash
# Generar migraciones (después de cambios en schema.prisma)
$ npx prisma migrate dev --name init

# Aplicar migraciones existentes
$ npx prisma migrate deploy

# Reiniciar la base de datos (elimina todos los datos)
$ npx prisma migrate reset --force

# Generar el cliente de Prisma
$ npx prisma generate
```

### Acceso a la base de datos

```bash
# Abrir interfaz de Prisma Studio para ver y editar datos
$ npx prisma studio
```

## Compilar y ejecutar el proyecto

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## 📚 Documentación del Proyecto

Este proyecto incluye documentación completa en la carpeta `/docs`:

### Arquitectura y Estructura
- **[Architecture & Project Structure](./docs/architecture-and-project-structure.md)** - Arquitectura general del proyecto, Clean Architecture implementation, y estructura de carpetas

### Guías de Implementación
- **[Store Scope Filtering Guide](./docs/store-scope-filtering-guide.md)** - 🔐 Sistema de filtrado automático por tienda basado en roles
- **[Domain Errors Guide](./docs/domain-errors-guide.md)** - 🚨 Errores de dominio y manejo de excepciones (NUEVO)
- **[Atomic Creation Implementation](./docs/atomic-creation-implementation.md)** - Creación atómica de entidades relacionadas
- **[Person Implementation Guide](./docs/person-implementation-guide.md)** - Implementación de la entidad Person
- **[Store Implementation Guide](./docs/store-implementation-guide.md)** - Implementación de tiendas multi-inquilino
- **[SUNAT Config Implementation](./docs/sunat-config-implementation-guide.md)** - Configuración de integración con SUNAT

### Sistema de Seguridad por Roles

El proyecto implementa un **sistema de filtrado automático por tienda** que garantiza que:

- 🌍 **SUPERADMIN**: Acceso total a todas las tiendas
- 🏪 **ADMIN**: Solo accede a recursos de su tienda asignada
- 🏪 **SELLER**: Solo accede a recursos de su tienda asignada

Ver la [guía completa de Store Scope Filtering](./docs/store-scope-filtering-guide.md) para más detalles.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
