
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { upload } from '@zoerai/integration';
import UploadHistory from './UploadHistory';

interface UploadedFile {
  id: number;
  filename: string;
  file_size: number;
  file_url: string;
  upload_status: 'uploaded' | 'processing' | 'done' | 'failed';
  error_message?: string;
  created_at: string;
}

export default function UploadTab() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

  const validateFile = (file: File): string | null => {
    if (!file.name.endsWith('.zip')) {
      return 'Only ZIP files are allowed';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 200MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
    }
    return null;
  };

  const startAnalysis = async (uploadId: number, fileUrl: string) => {
    try {
      await api.post('/analyze-upload', {
        file_upload_id: uploadId,
        file_url: fileUrl,
      });

      setUploads((prev) =>
        prev.map((u) =>
          u.id === uploadId ? { ...u, upload_status: 'processing' } : u
        )
      );

      toast.success('Analysis started with Gemini AI');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Analysis failed';
      toast.error(errorMsg);

      setUploads((prev) =>
        prev.map((u) =>
          u.id === uploadId
            ? { ...u, upload_status: 'failed', error_message: errorMsg }
            : u
        )
      );
    }
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadResult = await upload.uploadWithPresignedUrl(file, {
        maxSize: MAX_FILE_SIZE,
        onProgress: (progress) => setUploadProgress(progress),
      });

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      const fileUpload = await api.post<UploadedFile>('/file-uploads', {
        filename: file.name,
        file_size: file.size,
        file_url: uploadResult.url,
        upload_status: 'uploaded',
      });

      setUploads((prev) => [fileUpload, ...prev]);
      toast.success('File uploaded successfully');

      await startAnalysis(fileUpload.id, uploadResult.url!);

      setUploadProgress(0);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRetry = async (upload: UploadedFile) => {
    if (upload.upload_status === 'failed') {
      await startAnalysis(upload.id, upload.file_url);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Chat History</h1>
        <p className="text-muted-foreground mt-2">
          Upload your Claude Code chat history ZIP file for AI-powered analysis with Gemini
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Drag and drop your ZIP file</h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click the button below to browse
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✓ ZIP files only</p>
            <p>✓ Maximum file size: 200MB</p>
            <p>✓ AI-powered analysis with Google Gemini</p>
            <p>✓ Processing starts automatically after upload</p>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      <UploadHistory uploads={uploads} setUploads={setUploads} onRetry={handleRetry} />
    </div>
  );
}
