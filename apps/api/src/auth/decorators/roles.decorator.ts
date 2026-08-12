import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@srm-bats/database';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route to the given roles. Use together with RolesGuard, e.g.
 * `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('ADMIN', 'SUPER_ADMIN')`.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
