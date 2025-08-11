import Image from "next/image";
import { User } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import { ATTORNEY_PROFILE_IMAGE_CONSTANTS } from "./constants";
import { ATTORNEY_PROFILE_IMAGE_MESSAGES } from "./messages";
import { useAttorneyProfileImage } from "./hooks";

interface AttorneyProfileImageProps {
  profileImageStorageId?: Id<"_storage">;
  profileImage?: string;
  fullName: string;
}

export function AttorneyProfileImage({
  profileImageStorageId,
  profileImage,
  fullName,
}: AttorneyProfileImageProps) {
  const profileImageUrl = useAttorneyProfileImage(profileImageStorageId);

  const imageSource = profileImageUrl || profileImage;
  const altText = `${fullName} ${ATTORNEY_PROFILE_IMAGE_MESSAGES.ALT_TEXT_SUFFIX}`;

  return (
    <div className="relative flex-shrink-0">
      <div className={`${ATTORNEY_PROFILE_IMAGE_CONSTANTS.WIDTH_HEIGHT_CLASS} ${ATTORNEY_PROFILE_IMAGE_CONSTANTS.BORDER_RADIUS_CLASS} overflow-hidden bg-gray-100`}>
        {imageSource ? (
          <Image
            src={imageSource}
            alt={altText}
            width={ATTORNEY_PROFILE_IMAGE_CONSTANTS.SIZE}
            height={ATTORNEY_PROFILE_IMAGE_CONSTANTS.SIZE}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className={`${ATTORNEY_PROFILE_IMAGE_CONSTANTS.FALLBACK_ICON_SIZE} text-gray-400`} />
          </div>
        )}
      </div>
    </div>
  );
}