import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { User } from '../../domain/entities/user.entity';
import { AuthResult } from '../../domain/entities/auth.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { EntityStatus } from '../../domain/enums/entity-status.enum';
import { DocumentType } from '../../domain/enums/document-type.enum';
import { AuthInfrastructureService } from '../services/auth-infrastructure.service';

interface UserWithRelations {
  id: string;
  storeId: string;
  personId: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: EntityStatus;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  person: {
    id: string;
    documentType: DocumentType;
    documentNumber: string;
    names: string;
    legalName: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    status: EntityStatus;
    createdAt: Date;
    updatedAt: Date;
  };
  store: {
    id: string;
    businessName: string;
    ruc: string;
    legalName: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
    status: EntityStatus;
    registeredAt: Date;
    updatedAt: Date;
  };
}

@Injectable()
export class AuthPrismaRepository implements AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authInfrastructureService: AuthInfrastructureService,
  ) {}

  async findByEmail(email: string): Promise<UserWithRelations | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        person: true,
        store: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      storeId: user.storeId,
      personId: user.personId,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role as UserRole,
      status: user.status as EntityStatus,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      person: {
        id: user.person.id,
        documentType: user.person.documentType as DocumentType,
        documentNumber: user.person.documentNumber,
        names: user.person.names,
        legalName: user.person.legalName,
        address: user.person.address,
        phone: user.person.phone,
        email: user.person.email,
        status: user.person.status as EntityStatus,
        createdAt: user.person.createdAt,
        updatedAt: user.person.updatedAt,
      },
      store: {
        id: user.store.id,
        businessName: user.store.businessName,
        ruc: user.store.ruc,
        legalName: user.store.legalName,
        address: user.store.address,
        phone: user.store.phone,
        email: user.store.email,
        logoUrl: user.store.logoUrl,
        status: user.store.status as EntityStatus,
        registeredAt: user.store.registeredAt,
        updatedAt: user.store.updatedAt,
      },
    };
  }

  async validatePassword(user: UserWithRelations, password: string): Promise<boolean> {
    return this.authInfrastructureService.comparePassword(password, user.passwordHash);
  }

  async createAuthResult(user: UserWithRelations): Promise<AuthResult> {
    return this.authInfrastructureService.createAuthResult(user);
  }
}
