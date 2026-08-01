/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Injects the authenticated user (or one of its properties) from the request.
 * `@CurrentUser()` → full user, `@CurrentUser('id')` → just the id.
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  }
);
