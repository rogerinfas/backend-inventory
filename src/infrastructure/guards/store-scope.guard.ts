import { 
  Injectable, 
  CanActivate, 
  ExecutionContext,
  ForbiddenException 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { AuthPayload } from '../../domain/entities/auth.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { STORE_SCOPED_KEY } from '../decorators/store-scoped.decorator';

/**
 * Guard que implementa el filtrado automático por storeId según el rol del usuario.
 * 
 * Este guard trabaja en conjunto con el decorador @StoreScoped() y debe aplicarse
 * después del JwtAuthGuard para tener acceso al usuario autenticado.
 * 
 * Lógica:
 * 1. Si el endpoint no tiene @StoreScoped(), no hace nada (deja pasar)
 * 2. Si el usuario es SUPERADMIN, no aplica filtro (puede ver todo)
 * 3. Si el usuario es ADMIN/SELLER, valida que tenga storeId y lo agrega al request
 * 
 * El storeId se agrega al request como 'storeFilter' para que los use-cases lo consuman.
 */
@Injectable()
export class StoreScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Verificar si el endpoint tiene el decorador @StoreScoped
    const isStoreScoped = this.reflector.getAllAndOverride<boolean>(
      STORE_SCOPED_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no tiene el decorador, dejar pasar sin modificar
    if (!isStoreScoped) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'] as AuthPayload;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Si es SUPERADMIN, puede ver todos los recursos sin filtro
    if (user.role === UserRole.SUPERADMIN) {
      // No aplicar filtro, puede ver todos los stores
      request['storeFilter'] = {
        storeId: null, // null = sin filtro
        role: user.role,
        isSuperAdmin: true
      };
      return true;
    }

    // Para ADMIN o SELLER, el storeId es obligatorio
    if (user.role === UserRole.ADMIN || user.role === UserRole.SELLER) {
      if (!user.storeId) {
        throw new ForbiddenException(
          'El usuario no tiene asignada una tienda. Contacte al administrador.'
        );
      }

      // Agregar el filtro de store al request para que los use-cases lo usen
      request['storeFilter'] = {
        storeId: user.storeId,
        role: user.role,
        isSuperAdmin: false
      };
      
      return true;
    }

    // Rol no reconocido
    throw new ForbiddenException('Rol de usuario no válido');
  }
}

