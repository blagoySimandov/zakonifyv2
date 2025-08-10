"use client";

import { trpc } from "@/utils";
import type { Doc } from "../../../convex/_generated/dataModel";
import { ProfilePictureDisplay } from "./profile-picture-display";
import { UploadModal } from "./upload-modal";
import { useProfileUpload } from "./use-profile-upload";

interface ProfilePictureUploadProps {
  attorney: Doc<"attorneys">;
  onUploadSuccess?: (imageUrl: string) => void;
}

export function ProfilePictureUpload({
  attorney,
  onUploadSuccess,
}: ProfilePictureUploadProps) {
  const profileImageUrl = trpc.getStorageUrl.useQuery(
    { storageId: attorney.profileImageStorageId! },
    { enabled: !!attorney.profileImageStorageId }
  );

  const {
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
  } = useProfileUpload({ attorney, onUploadSuccess });

  return (
    <>
      <ProfilePictureDisplay
        imageUrl={profileImageUrl.data ?? undefined}
        fullName={attorney.fullName}
        onUploadClick={triggerFileSelect}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <UploadModal
        isOpen={showUploadModal}
        previewUrl={previewUrl}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        onCancel={handleCancel}
        onUpload={handleUpload}
        selectedFile={selectedFile}
      />
    </>
  );
}
