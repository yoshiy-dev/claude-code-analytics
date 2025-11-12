
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, validateRequestBody } from '@/lib/api-utils';

/**
 * Fix explanation:
 * - Cause: context.payload?.sub is typed as string | undefined, which breaks parseInt.
 * - Change: Added guards to ensure user_id exists, then parse using a narrowed variable (uid) with radix 10.
 * - Why: Prevents TypeScript errors while preserving behavior.
 */
export const GET = requestMiddleware(async (request, context) => {
  const prefsCrud = new CrudOperations('notification_preferences', context.token);
  const user_id = context.payload?.sub;

  if (!user_id) {
    return createErrorResponse({
      errorMessage: 'User not authenticated',
      status: 401,
    });
  }

  const uid = parseInt(user_id, 10);
  const data = await prefsCrud.findMany({ user_id: uid });

  if (data.length === 0) {
    return createSuccessResponse({ email_on_analysis_complete: true });
  }

  return createSuccessResponse(data[0]);
}, true);

export const PUT = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  const prefsCrud = new CrudOperations('notification_preferences', context.token);
  const user_id = context.payload?.sub;

  if (!user_id) {
    return createErrorResponse({
      errorMessage: 'User not authenticated',
      status: 401,
    });
  }

  const uid = parseInt(user_id, 10);
  const existing = await prefsCrud.findMany({ user_id: uid });

  if (existing.length === 0) {
    const data = await prefsCrud.create({
      user_id: uid,
      email_on_analysis_complete: body?.email_on_analysis_complete ?? true,
    });
    return createSuccessResponse(data);
  }

  const data = await prefsCrud.update(existing[0].id, {
    email_on_analysis_complete: body?.email_on_analysis_complete,
  });

  return createSuccessResponse(data);
}, true);
