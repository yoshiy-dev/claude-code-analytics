
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Github, Trash2 } from 'lucide-react';

interface UserProfile {
  display_name: string;
}

interface GitHubConnection {
  connection_status: 'connected' | 'disconnected';
  github_username?: string;
}

interface NotificationPreferences {
  email_on_analysis_complete: boolean;
}

export default function SettingsTab() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({ display_name: '' });
  const [github, setGithub] = useState<GitHubConnection>({
    connection_status: 'disconnected',
  });
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email_on_analysis_complete: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const [profileData, githubData, notificationsData] = await Promise.all([
        api.get<UserProfile>('/user-profile'),
        api.get<GitHubConnection>('/github-connection'),
        api.get<NotificationPreferences>('/notification-preferences'),
      ]);
      setProfile(profileData);
      setGithub(githubData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/user-profile', profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await api.put('/notification-preferences', notifications);
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnectGithub = async () => {
    try {
      await api.delete('/github-connection');
      setGithub({ connection_status: 'disconnected' });
      toast.success('GitHub disconnected');
    } catch (error) {
      toast.error('Failed to disconnect GitHub');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/user-account');
      toast.success('Account deleted');
      await logout();
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ''} disabled />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              value={profile.display_name}
              onChange={(e) =>
                setProfile({ ...profile, display_name: e.target.value })
              }
              placeholder="Enter your display name"
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>

      {/* GitHub Connection Section */}
      <Card>
        <CardHeader>
          <CardTitle>GitHub Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Github className="h-5 w-5" />
              <div>
                <p className="font-medium">
                  {github.connection_status === 'connected'
                    ? 'Connected'
                    : 'Not Connected'}
                </p>
                {github.github_username && (
                  <p className="text-sm text-muted-foreground">
                    @{github.github_username}
                  </p>
                )}
              </div>
            </div>
            {github.connection_status === 'connected' ? (
              <Button
                variant="destructive"
                onClick={handleDisconnectGithub}
              >
                Disconnect
              </Button>
            ) : (
              <Button disabled>
                Connect GitHub (Coming Soon)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Email on Analysis Complete</p>
              <p className="text-sm text-muted-foreground">
                Receive email notifications when analysis is complete
              </p>
            </div>
            <Switch
              checked={notifications.email_on_analysis_complete}
              onCheckedChange={(checked) =>
                setNotifications({
                  ...notifications,
                  email_on_analysis_complete: checked,
                })
              }
            />
          </div>
          <Button onClick={handleSaveNotifications} disabled={saving}>
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Deleting your account is permanent and cannot be undone.
            </AlertDescription>
          </Alert>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
