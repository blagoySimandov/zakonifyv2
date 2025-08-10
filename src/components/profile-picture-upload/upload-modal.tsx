"use client";

import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";
import { UploadProgress } from "./upload-progress";

interface UploadModalProps {
  isOpen: boolean;
  previewUrl: string | null;
  isUploading: boolean;
  uploadProgress: number;
  onCancel: () => void;
  onUpload: () => void;
  selectedFile: File | null;
}

export function UploadModal({
  isOpen,
  previewUrl,
  isUploading,
  uploadProgress,
  onCancel,
  onUpload,
  selectedFile,
}: UploadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-slate-900">
            Update Profile Picture
          </h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isUploading}>
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {previewUrl && (
            <div className="flex justify-center">
              <Image
                src={previewUrl}
                alt="Preview"
                width={128}
                height={128}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            </div>
          )}

          {isUploading && <UploadProgress progress={uploadProgress} />}

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isUploading}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-700 border border-slate-300 rounded-lg transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={onUpload}
              disabled={isUploading || !selectedFile}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50">
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
