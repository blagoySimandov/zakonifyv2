"use client";

import { useState, useRef, useCallback } from "react";
import { trpc } from "@/utils";
import type { Doc } from "../../../convex/_generated/dataModel";

interface UseProfileUploadProps {
  attorney: Doc<"attorneys">;
  onUploadSuccess?: (imageUrl: string) => void;
}

export function useProfileUpload({
  attorney,
  onUploadSuccess,
}: UseProfileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = trpc.generateUploadUrl.useMutation();
  const updateAttorney = trpc.attorneys.update.useMutation({
    onSuccess: () => {
      setShowUploadModal(false);
      setPreviewUrl(null);
      setSelectedFile(null);
      onUploadSuccess?.(previewUrl || "");
    },
  });

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setShowUploadModal(true);
    },
    []
  );

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadUrl = await generateUploadUrl.mutateAsync();

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();

      await updateAttorney.mutateAsync({
        id: attorney._id,
        profileImageStorageId: storageId,
      });

      setUploadProgress(100);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, generateUploadUrl, updateAttorney, attorney._id]);

  const handleCancel = useCallback(() => {
    setShowUploadModal(false);
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    isUploading,
    uploadProgress,
    showUploadModal,
    previewUrl,
    selectedFile,
    fileInputRef,
    handleFileSelect,
    handleUpload,
    handleCancel,
    triggerFileSelect,
  };
}
