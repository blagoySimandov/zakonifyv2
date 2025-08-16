"use client";

import Image from "next/image";
import { useState } from "react";
import { AttorneyRegistrationFormData } from "./validation";
import { REGISTRATION_CONSTANTS } from "./constants";
import { REGISTRATION_MESSAGES } from "@/messages";
import { PRACTICE_AREAS, PRACTICE_AREA_LABELS } from "@/constants";
import { Upload } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface PracticeLocationStepProps {
  formData: Partial<AttorneyRegistrationFormData>;
  errors: Record<string, string[]>;
  updateFormData: (updates: Partial<AttorneyRegistrationFormData>) => void;
}

export function PracticeLocationStep({
  formData,
  errors,
  updateFormData,
}: PracticeLocationStepProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const generateUploadUrlMutation = useMutation(api.storage.generateUploadUrl);
  
  const profileImageUrl = useQuery(
    api.storage.getUrl,
    formData.profileImageStorageId 
      ? { storageId: formData.profileImageStorageId as Id<"_storage"> }
      : "skip"
  );

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploadingImage(true);
    try {
      // Get upload URL from Convex
      const uploadUrlResult = await generateUploadUrlMutation();

      // Upload file to Convex storage
      const uploadResult = await fetch(uploadUrlResult, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResult.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await uploadResult.json();

      // Create preview URL for immediate display (not used in form data)

      // Update form data with storage ID
      updateFormData({
        profileImageStorageId: storageId,
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      // TODO: Show error toast or message to user
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePracticeAreaChange = (area: string, checked: boolean) => {
    const currentAreas = formData.practiceAreas || [];
    let newAreas: string[];

    if (checked) {
      newAreas = [...currentAreas, area];
    } else {
      newAreas = currentAreas.filter((a) => a !== area);
    }

    updateFormData({ practiceAreas: newAreas });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {REGISTRATION_CONSTANTS.STEP_TITLES.practiceAndLocation}
        </h2>
        <p className="text-gray-600 mb-6">
          {REGISTRATION_CONSTANTS.STEP_DESCRIPTIONS.practiceAndLocation}
        </p>
      </div>

      <div className="space-y-6">
        {/* Practice Areas */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {REGISTRATION_CONSTANTS.LABELS.PRACTICE_AREAS} *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PRACTICE_AREAS.map((area) => (
              <label
                key={area}
                className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={formData.practiceAreas?.includes(area) || false}
                  onChange={(e) =>
                    handlePracticeAreaChange(area, e.target.checked)
                  }
                  className="rounded text-primary-500"
                />
                <span className="text-sm text-gray-700">
                  {PRACTICE_AREA_LABELS[area]}
                </span>
              </label>
            ))}
          </div>
          {errors.practiceAreas && (
            <p className="text-danger-500 text-sm mt-1">
              {errors.practiceAreas[0]}
            </p>
          )}
          <p className="text-gray-500 text-sm mt-2">
            {REGISTRATION_MESSAGES.HELP.PRACTICE_AREAS}
          </p>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {REGISTRATION_CONSTANTS.LABELS.LOCATION} *
          </label>
          <div className="space-y-4">
            {/* City, State, Country row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  value={formData.location?.city || ""}
                  onChange={(e) =>
                    updateFormData({
                      location: {
                        ...formData.location,
                        city: e.target.value,
                        state: formData.location?.state || "",
                        address: formData.location?.address || "",
                        country: formData.location?.country || "Bulgaria",
                        zipCode: formData.location?.zipCode || "",
                      },
                    })
                  }
                  placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.CITY}
                  className={`w-full px-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    errors["location.city"]
                      ? "border-danger-300 bg-danger-50 focus:ring-danger-500"
                      : "border-gray-200 hover:border-gray-300 focus:bg-white"
                  }`}
                />
                {errors["location.city"] && (
                  <p className="text-danger-500 text-sm mt-1">
                    {errors["location.city"][0]}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  value={formData.location?.state || ""}
                  onChange={(e) =>
                    updateFormData({
                      location: {
                        ...formData.location,
                        state: e.target.value,
                        city: formData.location?.city || "",
                        address: formData.location?.address || "",
                        country: formData.location?.country || "Bulgaria",
                        zipCode: formData.location?.zipCode || "",
                      },
                    })
                  }
                  placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.STATE}
                  className={`w-full px-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    errors["location.state"]
                      ? "border-danger-300 bg-danger-50 focus:ring-danger-500"
                      : "border-gray-200 hover:border-gray-300 focus:bg-white"
                  }`}
                />
                {errors["location.state"] && (
                  <p className="text-danger-500 text-sm mt-1">
                    {errors["location.state"][0]}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  value="България"
                  disabled
                  className="w-full px-4 py-4 border rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Address field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                {REGISTRATION_CONSTANTS.LABELS.ADDRESS} *
              </label>
              <input
                type="text"
                value={formData.location?.address || ""}
                onChange={(e) =>
                  updateFormData({
                    location: {
                      ...formData.location,
                      address: e.target.value,
                      city: formData.location?.city || "",
                      state: formData.location?.state || "",
                      country: formData.location?.country || "Bulgaria",
                      zipCode: formData.location?.zipCode || "",
                    },
                  })
                }
                placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.ADDRESS}
                className={`w-full px-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  errors["location.address"]
                    ? "border-danger-300 bg-danger-50 focus:ring-danger-500"
                    : "border-gray-200 hover:border-gray-300 focus:bg-white"
                }`}
              />
              {errors["location.address"] && (
                <p className="text-danger-500 text-sm mt-1">
                  {errors["location.address"][0]}
                </p>
              )}
            </div>

            {/* Zip Code field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                {REGISTRATION_CONSTANTS.LABELS.ZIP_CODE}
              </label>
              <input
                type="text"
                value={formData.location?.zipCode || ""}
                onChange={(e) =>
                  updateFormData({
                    location: {
                      ...formData.location,
                      zipCode: e.target.value,
                      city: formData.location?.city || "",
                      state: formData.location?.state || "",
                      address: formData.location?.address || "",
                      country: formData.location?.country || "Bulgaria",
                    },
                  })
                }
                placeholder={REGISTRATION_CONSTANTS.PLACEHOLDERS.ZIP_CODE}
                className={`w-full px-4 py-4 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  errors["location.zipCode"]
                    ? "border-danger-300 bg-danger-50 focus:ring-danger-500"
                    : "border-gray-200 hover:border-gray-300 focus:bg-white"
                }`}
              />
              {errors["location.zipCode"] && (
                <p className="text-danger-500 text-sm mt-1">
                  {errors["location.zipCode"][0]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Профилна снимка
          </label>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt="Преглед на профила"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>

            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
                className="hidden"
                id="profile-picture-upload"
                disabled={isUploadingImage}
              />
              <label
                htmlFor="profile-picture-upload"
                className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors ${
                  isUploadingImage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Upload className="w-4 h-4" />
                {isUploadingImage ? "Качване..." : "Качи снимка"}
              </label>
              <p className="text-gray-500 text-xs mt-1">
                JPG, PNG или GIF (макс 5MB)
              </p>
              {isUploadingImage && (
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mt-2"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
