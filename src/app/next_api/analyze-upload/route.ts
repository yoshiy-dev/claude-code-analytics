
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, validateRequestBody } from '@/lib/api-utils';
import { analyzeWithGemini, extractTextFromZip } from '@/lib/gemini-analyzer';
import { generateAdminUserToken } from '@/lib/auth';

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);

  if (!body.file_upload_id || !body.file_url) {
    return createErrorResponse({
      errorMessage: 'file_upload_id and file_url are required',
      status: 400,
    });
  }

  try {
    // Use admin token for database operations (no user authentication required)
    const adminToken = await generateAdminUserToken();

    // Update upload status to processing
    const uploadsCrud = new CrudOperations('file_uploads', adminToken);
    await uploadsCrud.update(body.file_upload_id, {
      upload_status: 'processing',
    });

    // Download the ZIP file
    const response = await fetch(body.file_url);
    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const arrayBuffer = await response.arrayBuffer();
    
    // Extract text content from ZIP
    const textContent = await extractTextFromZip(arrayBuffer);
    
    // Get filename from upload record
    const uploadRecord = await uploadsCrud.findById(body.file_upload_id);
    const fileName = uploadRecord?.filename || 'unknown.zip';

    // Analyze using Gemini API
    const analysisResult = await analyzeWithGemini(textContent, fileName);

    // Save analysis report
    const reportsCrud = new CrudOperations('analysis_reports', adminToken);
    const report = await reportsCrud.create({
      user_id: null, // No user authentication
      file_upload_id: body.file_upload_id,
      phase: 'completed',
      estimated_commit_count: analysisResult.estimated_commit_count,
      learning_curve_score: analysisResult.learning_curve_score,
      active_hours_heatmap: analysisResult.active_hours_heatmap,
      summary_json: {
        main_topics: analysisResult.main_topics,
        issue_categories: analysisResult.issue_categories,
        recommended_actions: analysisResult.recommended_actions,
        warnings: analysisResult.warnings,
        summary: analysisResult.summary,
      },
      analysis_timestamp: new Date().toISOString(),
    });

    // Update upload status to done
    await uploadsCrud.update(body.file_upload_id, {
      upload_status: 'done',
    });

    return createSuccessResponse(report, 201);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Analysis failed';
    console.error('Analysis error:', error);

    // Update upload status to failed
    try {
      const adminToken = await generateAdminUserToken();
      const uploadsCrud = new CrudOperations('file_uploads', adminToken);
      await uploadsCrud.update(body.file_upload_id, {
        upload_status: 'failed',
        error_message: errorMsg,
      });
    } catch (updateError) {
      console.error('Failed to update upload status:', updateError);
    }

    return createErrorResponse({
      errorMessage: errorMsg,
      status: 500,
    });
  }
}, false); // No authentication required
