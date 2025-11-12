
'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, Clock, XCircle, Upload, Trash2, RotateCcw, Eye } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import Link from 'next/link';

interface UploadedFile {
  id: number;
  filename: string;
  file_size: number;
  file_url: string;
  upload_status: 'uploaded' | 'processing' | 'done' | 'failed';
  error_message?: string;
  created_at: string;
}

interface UploadHistoryProps {
  uploads: UploadedFile[];
  setUploads: (uploads: UploadedFile[]) => void;
  onRetry?: (upload: UploadedFile) => void;
}

export default function UploadHistory({ uploads, setUploads, onRetry }: UploadHistoryProps) {
  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const data = await api.get<UploadedFile[]>('/file-uploads');
      setUploads(data);
    } catch (error) {
      console.error('Failed to fetch uploads:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/file-uploads?id=${id}`);
      setUploads(uploads.filter((u) => u.id !== id));
      toast.success('Upload deleted');
    } catch (error) {
      toast.error('Failed to delete upload');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Done
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-blue-500">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Upload className="h-3 w-3 mr-1" />
            Uploaded
          </Badge>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload History</CardTitle>
      </CardHeader>
      <CardContent>
        {uploads.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No uploads yet. Start by uploading a ZIP file above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploads.map((upload) => (
                  <TableRow key={upload.id}>
                    <TableCell className="font-medium">{upload.filename}</TableCell>
                    <TableCell>{formatFileSize(upload.file_size)}</TableCell>
                    <TableCell>{formatDate(upload.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(upload.upload_status)}
                        {upload.error_message && (
                          <p className="text-xs text-red-500">{upload.error_message}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {upload.upload_status === 'done' && (
                          <Link href={`/dashboard/reports?upload_id=${upload.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        {upload.upload_status === 'failed' && onRetry && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRetry(upload)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(upload.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
