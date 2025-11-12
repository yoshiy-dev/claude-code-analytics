
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';
import { generateAdminUserToken } from '@/lib/auth';

export const GET = requestMiddleware(async (request, context) => {
  const { limit, offset } = parseQueryParams(request);
  const adminToken = await generateAdminUserToken();
  const uploadsCrud = new CrudOperations('file_uploads', adminToken);
  const data = await uploadsCrud.findMany(
    {},
    { limit, offset, orderBy: { column: 'created_at', direction: 'desc' } }
  );
  return createSuccessResponse(data);
}, false); // No authentication required

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);

  if (!body.filename || !body.file_size || !body.file_url) {
    return createErrorResponse({
      errorMessage: 'Missing required fields: filename, file_size, file_url',
      status: 400,
    });
  }

  // Validate file size (hard limit 210MB)
  const HARD_LIMIT = 210 * 1024 * 1024;
  if (body.file_size > HARD_LIMIT) {
    return createErrorResponse({
      errorMessage: 'File size exceeds maximum limit of 210MB',
      status: 413,
    });
  }

  const adminToken = await generateAdminUserToken();
  const uploadsCrud = new CrudOperations('file_uploads', adminToken);

  const data = await uploadsCrud.create({
    user_id: null, // No user authentication
    filename: body.filename,
    file_size: body.file_size,
    file_url: body.file_url,
    upload_status: body.upload_status || 'uploaded',
  });

  return createSuccessResponse(data, 201);
}, false); // No authentication required

export const PUT = requestMiddleware(async (request, context) => {
  const { id } = parseQueryParams(request);
  const body = await validateRequestBody(request);

  if (!id) {
    return createErrorResponse({
      errorMessage: 'ID parameter is required',
      status: 400,
    });
  }

  const adminToken = await generateAdminUserToken();
  const uploadsCrud = new CrudOperations('file_uploads', adminToken);
  const existing = await uploadsCrud.findById(id);

  if (!existing) {
    return createErrorResponse({
      errorMessage: 'Upload not found',
      status: 404,
    });
  }

  const data = await uploadsCrud.update(id, body);
  return createSuccessResponse(data);
}, false); // No authentication required

export const DELETE = requestMiddleware(async (request, context) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return createErrorResponse({
      errorMessage: 'ID parameter is required',
      status: 400,
    });
  }

  const adminToken = await generateAdminUserToken();
  const uploadsCrud = new CrudOperations('file_uploads', adminToken);
  const existing = await uploadsCrud.findById(id);

  if (!existing) {
    return createErrorResponse({
      errorMessage: 'Upload not found',
      status: 404,
    });
  }

  const data = await uploadsCrud.delete(id);
  return createSuccessResponse(data);
}, false); // No authentication required
