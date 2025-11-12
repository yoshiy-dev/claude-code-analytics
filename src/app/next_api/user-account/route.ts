
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware } from '@/lib/api-utils';
import { generateAdminUserToken } from '@/lib/auth';

export const DELETE = requestMiddleware(async (request, context) => {
  const user_id = context.payload?.sub;

  if (!user_id) {
    return createErrorResponse({
      errorMessage: 'User not authenticated',
      status: 401,
    });
  }

  try {
    const adminToken = await generateAdminUserToken();

    // Delete all related data
    const fileUploadsCrud = new CrudOperations('file_uploads', adminToken);
    const reportsCrud = new CrudOperations('analysis_reports', adminToken);
    const profilesCrud = new CrudOperations('user_profiles', adminToken);
    const githubCrud = new CrudOperations('github_connections', adminToken);
    const notificationsCrud = new CrudOperations('notification_preferences', adminToken);

    // Get all user's uploads and reports
    const uploads = await fileUploadsCrud.findMany({ user_id: parseInt(user_id) });
    const reports = await reportsCrud.findMany({ user_id: parseInt(user_id) });

    // Delete reports and their related data
    for (const report of reports) {
      const topicsCrud = new CrudOperations('report_topics', adminToken);
      const issuesCrud = new CrudOperations('report_issues', adminToken);
      const actionsCrud = new CrudOperations('report_actions', adminToken);

      const topics = await topicsCrud.findMany({ report_id: report.id });
      const issues = await issuesCrud.findMany({ report_id: report.id });
      const actions = await actionsCrud.findMany({ report_id: report.id });

      for (const topic of topics) {
        await topicsCrud.delete(topic.id);
      }
      for (const issue of issues) {
        await issuesCrud.delete(issue.id);
      }
      for (const action of actions) {
        await actionsCrud.delete(action.id);
      }

      await reportsCrud.delete(report.id);
    }

    // Delete uploads
    for (const upload of uploads) {
      await fileUploadsCrud.delete(upload.id);
    }

    // Delete user profile
    const profiles = await profilesCrud.findMany({ user_id: parseInt(user_id) });
    for (const profile of profiles) {
      await profilesCrud.delete(profile.id);
    }

    // Delete GitHub connection
    const connections = await githubCrud.findMany({ user_id: parseInt(user_id) });
    for (const connection of connections) {
      await githubCrud.delete(connection.id);
    }

    // Delete notification preferences
    const prefs = await notificationsCrud.findMany({ user_id: parseInt(user_id) });
    for (const pref of prefs) {
      await notificationsCrud.delete(pref.id);
    }

    return createSuccessResponse({ success: true });
  } catch (error) {
    console.error('Error deleting account:', error);
    return createErrorResponse({
      errorMessage: 'Failed to delete account',
      status: 500,
    });
  }
}, true);
