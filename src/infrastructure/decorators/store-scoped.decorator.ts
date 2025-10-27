import { SetMetadata } from '@nestjs/common';

export const STORE_SCOPED_KEY = 'isStoreScoped';

/**
 * Decorator que marca un endpoint para filtrar automáticamente por storeId
 * según el rol del usuario autenticado.
 * 
 * Comportamiento:
 * - SUPERADMIN: Ve todos los recursos sin filtro de storeId
 * - ADMIN/SELLER: Solo ve recursos asociados a su storeId
 * 
 * @example
 * ```typescript
 * @Get()
 * @StoreScoped()
 * async findAll() {
 *   // Este endpoint filtrará automáticamente por storeId
 *   // excepto para SUPERADMIN
 * }
 * ```
 */
export const StoreScoped = () => SetMetadata(STORE_SCOPED_KEY, true);

