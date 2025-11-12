
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams } from '@/lib/api-utils';

export const GET = requestMiddleware(async (request, context) => {
  const { report_id } = parseQueryParams(request);

  if (!report_id) {
    return createErrorResponse({
      errorMessage: 'report_id parameter is required',
      status: 400,
    });
  }

  const topicsCrud = new CrudOperations('report_topics', context.token);
  const data = await topicsCrud.findMany(
    { report_id: parseInt(report_id) },
    { orderBy: { column: 'frequency', direction: 'desc' } }
  );

  return createSuccessResponse(data);
}, true);
