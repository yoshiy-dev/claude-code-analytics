
-- User profiles table for display name and additional user information
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create default profile for admin user (user_id=1)
INSERT INTO user_profiles (user_id, display_name) VALUES (1, 'Administrator');

-- File uploads table to track ZIP file uploads
CREATE TABLE file_uploads (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    filename VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    upload_status VARCHAR(50) DEFAULT 'uploaded' CHECK (upload_status IN ('uploaded', 'processing', 'done', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analysis reports table to store analysis results and KPIs
CREATE TABLE analysis_reports (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_upload_id BIGINT NOT NULL,
    phase VARCHAR(50),
    estimated_commit_count INTEGER,
    learning_curve_score INTEGER CHECK (learning_curve_score >= 0 AND learning_curve_score <= 100),
    active_hours_heatmap JSONB,
    analysis_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Report topics table to store main topics frequency
CREATE TABLE report_topics (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    report_id BIGINT NOT NULL,
    topic_name VARCHAR(200) NOT NULL,
    frequency INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Report issues table to store issue categories
CREATE TABLE report_issues (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    report_id BIGINT NOT NULL,
    category VARCHAR(200) NOT NULL,
    issue_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Report actions table to store recommended actions
CREATE TABLE report_actions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    report_id BIGINT NOT NULL,
    action_text TEXT NOT NULL,
    priority INTEGER CHECK (priority >= 1 AND priority <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- GitHub connections table (placeholder for Phase 1)
CREATE TABLE github_connections (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    github_username VARCHAR(100),
    connection_status VARCHAR(50) DEFAULT 'disconnected' CHECK (connection_status IN ('connected', 'disconnected')),
    connected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notification preferences table
CREATE TABLE notification_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    email_on_analysis_complete BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance optimization
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX idx_file_uploads_status ON file_uploads(upload_status);
CREATE INDEX idx_analysis_reports_user_id ON analysis_reports(user_id);
CREATE INDEX idx_analysis_reports_file_upload_id ON analysis_reports(file_upload_id);
CREATE INDEX idx_report_topics_report_id ON report_topics(report_id);
CREATE INDEX idx_report_topics_user_id ON report_topics(user_id);
CREATE INDEX idx_report_issues_report_id ON report_issues(report_id);
CREATE INDEX idx_report_issues_user_id ON report_issues(user_id);
CREATE INDEX idx_report_actions_report_id ON report_actions(report_id);
CREATE INDEX idx_report_actions_user_id ON report_actions(user_id);
CREATE INDEX idx_github_connections_user_id ON github_connections(user_id);
CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Enable Row Level Security for all user-related tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY user_profiles_select_policy ON user_profiles
    FOR SELECT USING (user_id = uid());

CREATE POLICY user_profiles_insert_policy ON user_profiles
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY user_profiles_update_policy ON user_profiles
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY user_profiles_delete_policy ON user_profiles
    FOR DELETE USING (user_id = uid());

-- RLS policies for file_uploads
CREATE POLICY file_uploads_select_policy ON file_uploads
    FOR SELECT USING (user_id = uid());

CREATE POLICY file_uploads_insert_policy ON file_uploads
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY file_uploads_update_policy ON file_uploads
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY file_uploads_delete_policy ON file_uploads
    FOR DELETE USING (user_id = uid());

-- RLS policies for analysis_reports
CREATE POLICY analysis_reports_select_policy ON analysis_reports
    FOR SELECT USING (user_id = uid());

CREATE POLICY analysis_reports_insert_policy ON analysis_reports
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY analysis_reports_update_policy ON analysis_reports
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY analysis_reports_delete_policy ON analysis_reports
    FOR DELETE USING (user_id = uid());

-- RLS policies for report_topics
CREATE POLICY report_topics_select_policy ON report_topics
    FOR SELECT USING (user_id = uid());

CREATE POLICY report_topics_insert_policy ON report_topics
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY report_topics_update_policy ON report_topics
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY report_topics_delete_policy ON report_topics
    FOR DELETE USING (user_id = uid());

-- RLS policies for report_issues
CREATE POLICY report_issues_select_policy ON report_issues
    FOR SELECT USING (user_id = uid());

CREATE POLICY report_issues_insert_policy ON report_issues
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY report_issues_update_policy ON report_issues
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY report_issues_delete_policy ON report_issues
    FOR DELETE USING (user_id = uid());

-- RLS policies for report_actions
CREATE POLICY report_actions_select_policy ON report_actions
    FOR SELECT USING (user_id = uid());

CREATE POLICY report_actions_insert_policy ON report_actions
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY report_actions_update_policy ON report_actions
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY report_actions_delete_policy ON report_actions
    FOR DELETE USING (user_id = uid());

-- RLS policies for github_connections
CREATE POLICY github_connections_select_policy ON github_connections
    FOR SELECT USING (user_id = uid());

CREATE POLICY github_connections_insert_policy ON github_connections
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY github_connections_update_policy ON github_connections
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY github_connections_delete_policy ON github_connections
    FOR DELETE USING (user_id = uid());

-- RLS policies for notification_preferences
CREATE POLICY notification_preferences_select_policy ON notification_preferences
    FOR SELECT USING (user_id = uid());

CREATE POLICY notification_preferences_insert_policy ON notification_preferences
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY notification_preferences_update_policy ON notification_preferences
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY notification_preferences_delete_policy ON notification_preferences
    FOR DELETE USING (user_id = uid());

-- 既存のRLSポリシーとテーブルを削除
DROP POLICY IF EXISTS analysis_reports_delete_policy ON analysis_reports;
DROP POLICY IF EXISTS analysis_reports_insert_policy ON analysis_reports;
DROP POLICY IF EXISTS analysis_reports_select_policy ON analysis_reports;
DROP POLICY IF EXISTS analysis_reports_update_policy ON analysis_reports;
DROP POLICY IF EXISTS file_uploads_delete_policy ON file_uploads;
DROP POLICY IF EXISTS file_uploads_insert_policy ON file_uploads;
DROP POLICY IF EXISTS file_uploads_select_policy ON file_uploads;
DROP POLICY IF EXISTS file_uploads_update_policy ON file_uploads;
DROP POLICY IF EXISTS report_actions_delete_policy ON report_actions;
DROP POLICY IF EXISTS report_actions_insert_policy ON report_actions;
DROP POLICY IF EXISTS report_actions_select_policy ON report_actions;
DROP POLICY IF EXISTS report_actions_update_policy ON report_actions;
DROP POLICY IF EXISTS report_issues_delete_policy ON report_issues;
DROP POLICY IF EXISTS report_issues_insert_policy ON report_issues;
DROP POLICY IF EXISTS report_issues_select_policy ON report_issues;
DROP POLICY IF EXISTS report_issues_update_policy ON report_issues;
DROP POLICY IF EXISTS report_topics_delete_policy ON report_topics;
DROP POLICY IF EXISTS report_topics_insert_policy ON report_topics;
DROP POLICY IF EXISTS report_topics_select_policy ON report_topics;
DROP POLICY IF EXISTS report_topics_update_policy ON report_topics;

-- RLSを無効化
ALTER TABLE analysis_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads DISABLE ROW LEVEL SECURITY;
ALTER TABLE report_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE report_issues DISABLE ROW LEVEL SECURITY;
ALTER TABLE report_topics DISABLE ROW LEVEL SECURITY;

-- 認証関連テーブルを削除
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS github_connections CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS user_passcode CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 既存テーブルからuser_idカラムを削除
ALTER TABLE analysis_reports DROP COLUMN IF EXISTS user_id;
ALTER TABLE file_uploads DROP COLUMN IF EXISTS user_id;
ALTER TABLE report_actions DROP COLUMN IF EXISTS user_id;
ALTER TABLE report_issues DROP COLUMN IF EXISTS user_id;
ALTER TABLE report_topics DROP COLUMN IF EXISTS user_id;

-- インデックスを再作成（user_id関連のインデックスは削除済み）
DROP INDEX IF EXISTS idx_analysis_reports_user_id;
DROP INDEX IF EXISTS idx_file_uploads_user_id;
DROP INDEX IF EXISTS idx_report_actions_user_id;
DROP INDEX IF EXISTS idx_report_issues_user_id;
DROP INDEX IF EXISTS idx_report_topics_user_id;

-- テスト用のサンプルデータを挿入
INSERT INTO file_uploads (filename, file_size, file_url, upload_status) VALUES
('claude_code_export_2024_01.zip', 1024000, 'https://example.com/files/export1.zip', 'uploaded'),
('claude_code_export_2024_02.zip', 2048000, 'https://example.com/files/export2.zip', 'processing'),
('claude_code_export_2024_03.zip', 1536000, 'https://example.com/files/export3.zip', 'done'),
('claude_code_export_2024_04.zip', 3072000, 'https://example.com/files/export4.zip', 'uploaded'),
('claude_code_export_2024_05.zip', 2560000, 'https://example.com/files/export5.zip', 'done');

INSERT INTO analysis_reports (file_upload_id, phase, estimated_commit_count, learning_curve_score, active_hours_heatmap) VALUES
(3, 'Advanced', 150, 85, '{"0": 5, "1": 2, "8": 15, "9": 20, "10": 25, "14": 18, "15": 22, "16": 12, "20": 8, "21": 6}'),
(5, 'Intermediate', 80, 65, '{"0": 3, "1": 1, "9": 12, "10": 18, "11": 20, "14": 15, "15": 16, "16": 10, "20": 5, "21": 4}');

INSERT INTO report_topics (report_id, topic_name, frequency) VALUES
(1, 'React Components', 45),
(1, 'API Integration', 32),
(1, 'Database Design', 28),
(1, 'Authentication', 25),
(1, 'UI/UX Design', 20),
(2, 'TypeScript', 38),
(2, 'Next.js', 30),
(2, 'State Management', 22),
(2, 'Testing', 18),
(2, 'Performance', 15);

INSERT INTO report_issues (report_id, category, issue_count) VALUES
(1, 'Type Errors', 12),
(1, 'API Errors', 8),
(1, 'Build Errors', 5),
(1, 'Runtime Errors', 3),
(2, 'Type Errors', 15),
(2, 'Linting Issues', 10),
(2, 'Import Errors', 6),
(2, 'Configuration Issues', 4);

INSERT INTO report_actions (report_id, action_text, priority) VALUES
(1, 'Review and refactor complex components for better maintainability', 5),
(1, 'Implement comprehensive error handling for API calls', 4),
(1, 'Add unit tests for critical business logic', 4),
(1, 'Optimize database queries for better performance', 3),
(1, 'Document API endpoints and data models', 2),
(2, 'Strengthen TypeScript type definitions', 5),
(2, 'Implement proper error boundaries', 4),
(2, 'Add integration tests for key user flows', 3),
(2, 'Optimize bundle size and loading performance', 3),
(2, 'Set up automated code quality checks', 2);

-- 既存のテーブルをすべて削除
DROP TABLE IF EXISTS report_topics CASCADE;
DROP TABLE IF EXISTS report_issues CASCADE;
DROP TABLE IF EXISTS report_actions CASCADE;
DROP TABLE IF EXISTS analysis_reports CASCADE;
DROP TABLE IF EXISTS file_uploads CASCADE;

-- シーケンスも削除
DROP SEQUENCE IF EXISTS report_topics_id_seq CASCADE;
DROP SEQUENCE IF EXISTS report_issues_id_seq CASCADE;
DROP SEQUENCE IF EXISTS report_actions_id_seq CASCADE;
DROP SEQUENCE IF EXISTS analysis_reports_id_seq CASCADE;
DROP SEQUENCE IF EXISTS file_uploads_id_seq CASCADE;
