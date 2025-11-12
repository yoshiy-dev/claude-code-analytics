
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware } from '@/lib/api-utils';

/**
 * Fix explanation:
 * - Cause: context.payload?.sub returns string | undefined due to optional chaining. Passing it to parseInt caused a TypeScript type error.
 * - Change: Added a guard to ensure user_id exists before parsing, and used a narrowed variable (uid) with radix 10.
 * - Why: This ensures parseInt receives a string and prevents type errors during build while keeping functionality unchanged.
 */
export const GET = requestMiddleware(async (request, context) => {
  const connectionsCrud = new CrudOperations('github_connections', context.token);
  const user_id = context.payload?.sub;

  if (!user_id) {
    return createErrorResponse({
      errorMessage: 'User not authenticated',
      status: 401,
    });
  }

  const uid = parseInt(user_id, 10);
  const data = await connectionsCrud.findMany({ user_id: uid });

  if (data.length === 0) {
    return createSuccessResponse({ connection_status: 'disconnected' });
  }

  return createSuccessResponse(data[0]);
}, true);

export const DELETE = requestMiddleware(async (request, context) => {
  const connectionsCrud = new CrudOperations('github_connections', context.token);
  const user_id = context.payload?.sub;

  if (!user_id) {
    return createErrorResponse({
      errorMessage: 'User not authenticated',
      status: 401,
    });
  }

  const uid = parseInt(user_id, 10);
  const existing = await connectionsCrud.findMany({ user_id: uid });

  if (existing.length === 0) {
    return createErrorResponse({
      errorMessage: 'GitHub connection not found',
      status: 404,
    });
  }

  const data = await connectionsCrud.update(existing[0].id, {
    connection_status: 'disconnected',
    github_username: null,
  });

  return createSuccessResponse(data);
}, true);
