
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, validateRequestBody } from '@/lib/api-utils';

/**
 * Fix explanation:
 * - Cause: parseInt(context.payload?.sub) received a union type (string | undefined).
 * - Change: Added user_id existence checks and used a narrowed uid variable with radix 10 before parseInt.
 * - Why: Ensures type safety and successful builds while keeping logic intact.
 */
export const GET = requestMiddleware(async (request, context) => {
  const profilesCrud = new CrudOperations('user_profiles', context.token);
  const user_id = context.payload?.sub;

  if (!user_id) {
    return createErrorResponse({
      errorMessage: 'User not authenticated',
      status: 401,
    });
  }

  const uid = parseInt(user_id, 10);
  const data = await profilesCrud.findMany({ user_id: uid });

  if (data.length === 0) {
    return createSuccessResponse({ display_name: '' });
  }

  return createSuccessResponse(data[0]);
}, true);

export const PUT = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  const profilesCrud = new CrudOperations('user_profiles', context.token);
  const user_id = context.payload?.sub;

  if (!user_id) {
    return createErrorResponse({
      errorMessage: 'User not authenticated',
      status: 401,
    });
  }

  const uid = parseInt(user_id, 10);
  const existing = await profilesCrud.findMany({ user_id: uid });

  if (existing.length === 0) {
    const data = await profilesCrud.create({
      user_id: uid,
      display_name: body?.display_name,
    });
    return createSuccessResponse(data);
  }

  const data = await profilesCrud.update(existing[0].id, {
    display_name: body?.display_name,
  });

  return createSuccessResponse(data);
}, true);
