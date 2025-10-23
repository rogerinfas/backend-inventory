import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../controllers/auth.controller';
import { AuthApplicationService } from '../../application/services/auth.service';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { ValidateTokenUseCase } from '../../application/use-cases/auth/validate-token.use-case';
import { GetMeUseCase } from '../../application/use-cases/auth/get-me.use-case';
import { AuthPrismaRepository } from '../repositories/auth-prisma.repository';
import { UserPrismaRepository } from '../repositories/user.repository';
import { AuthInfrastructureService } from '../services/auth-infrastructure.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { 
        expiresIn: '24h',
        issuer: 'inventory-backend',
        audience: 'inventory-frontend',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Services
    AuthApplicationService,
    {
      provide: 'AuthService',
      useClass: AuthInfrastructureService,
    },
    AuthInfrastructureService,
    
    // Use Cases
    LoginUseCase,
    ValidateTokenUseCase,
    GetMeUseCase,
    
    // Repositories
    {
      provide: 'AuthRepository',
      useClass: AuthPrismaRepository,
    },
    AuthPrismaRepository,
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
    UserPrismaRepository,
    
    // Guards
    JwtAuthGuard,
  ],
  exports: [
    AuthApplicationService,
    JwtAuthGuard,
    JwtModule,
  ],
})
export class AuthModule {}
