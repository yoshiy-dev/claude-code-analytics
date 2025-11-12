
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams } from '@/lib/api-utils';

export const GET = requestMiddleware(async (request, context) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return createErrorResponse({
      errorMessage: 'report_id parameter is required',
      status: 400,
    });
  }

  const actionsCrud = new CrudOperations('report_actions', context.token);
  const data = await actionsCrud.findMany(
    { report_id: parseInt(id) },
    { orderBy: { column: 'priority', direction: 'asc' } }
  );

  return createSuccessResponse(data);
}, true);
