
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';
import { generateAdminUserToken } from '@/lib/auth';

export const GET = requestMiddleware(async (request, context) => {
  const { limit, offset, id } = parseQueryParams(request);
  const searchParams = request.nextUrl.searchParams;
  const file_upload_id = searchParams.get('file_upload_id');

  const adminToken = await generateAdminUserToken();
  const reportsCrud = new CrudOperations('analysis_reports', adminToken);

  if (id) {
    const data = await reportsCrud.findById(id);
    if (!data) {
      return createErrorResponse({
        errorMessage: 'Report not found',
        status: 404,
      });
    }
    return createSuccessResponse(data);
  }

  // Filter by file_upload_id if provided
  const filters: Record<string, any> = {};
  if (file_upload_id) {
    filters.file_upload_id = parseInt(file_upload_id);
  }

  const data = await reportsCrud.findMany(
    filters,
    { limit, offset, orderBy: { column: 'analysis_timestamp', direction: 'desc' } }
  );
  return createSuccessResponse(data);
}, false); // No authentication required

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);

  if (!body.file_upload_id) {
    return createErrorResponse({
      errorMessage: 'file_upload_id is required',
      status: 400,
    });
  }

  const adminToken = await generateAdminUserToken();
  const reportsCrud = new CrudOperations('analysis_reports', adminToken);

  const data = await reportsCrud.create({
    user_id: null, // No user authentication
    file_upload_id: body.file_upload_id,
    phase: body.phase || 'initial',
    estimated_commit_count: body.estimated_commit_count || 0,
    learning_curve_score: body.learning_curve_score || 0,
    active_hours_heatmap: body.active_hours_heatmap || {},
    summary_json: body.summary_json || {},
    analysis_timestamp: new Date().toISOString(),
  });

  return createSuccessResponse(data, 201);
}, false); // No authentication required
