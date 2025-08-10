"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

interface ProfilePictureDisplayProps {
  imageUrl?: string;
  fullName: string;
  onUploadClick: () => void;
}

export function ProfilePictureDisplay({
  imageUrl,
  fullName,
  onUploadClick,
}: ProfilePictureDisplayProps) {
  return (
    <div className="relative">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={fullName}
          width={80}
          height={80}
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
        />
      ) : (
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
          <Camera className="w-8 h-8 text-blue-600" />
        </div>
      )}

      <button
        onClick={onUploadClick}
        className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg">
        <Camera className="h-3 w-3" />
      </button>
    </div>
  );
}
