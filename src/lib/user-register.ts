
import CrudOperations from '@/lib/crud-operations';
import { generateAdminUserToken } from '@/lib/auth';

export async function userRegisterCallback(user: {
  id: string;
  email: string;
  role: string;
}): Promise<void> {
  try {
    const adminToken = await generateAdminUserToken();

    // Create user profile
    const profilesCrud = new CrudOperations('user_profiles', adminToken);
    await profilesCrud.create({
      user_id: parseInt(user.id),
      display_name: user.email.split('@')[0],
    });

    // Create GitHub connection record
    const githubCrud = new CrudOperations('github_connections', adminToken);
    await githubCrud.create({
      user_id: parseInt(user.id),
      connection_status: 'disconnected',
    });

    // Create notification preferences
    const notificationsCrud = new CrudOperations('notification_preferences', adminToken);
    await notificationsCrud.create({
      user_id: parseInt(user.id),
      email_on_analysis_complete: true,
    });

    console.log(`Created user profile and settings for user ${user.id}`);
  } catch (error) {
    console.error('Failed to create user profile:', error);
  }
}
