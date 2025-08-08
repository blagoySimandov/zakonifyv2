"use client";

import { useState, useRef } from "react";
import { trpc } from "@/utils";
import { AttorneyLayout, ProfilePictureUpload } from "@/components";
import { MOCK_ATTORNEY_ID } from "@/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, Save, Shield } from "lucide-react";
import type { Doc } from "../../../../convex/_generated/dataModel";

export default function AttorneySettings() {
  const [attorneyId] = useState<string>(MOCK_ATTORNEY_ID);
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<any>({});

  // Fetch attorney data
  const attorneyQuery = trpc.attorneys.getById.useQuery({ id: attorneyId });
  const attorney = attorneyQuery.data as Doc<"attorneys"> | null;

  // Update attorney mutation
  const updateAttorney = trpc.attorneys.update.useMutation({
    onSuccess: () => {
      attorneyQuery.refetch();
      setIsEditing({});
    },
  });

  const handleEdit = (field: string) => {
    setIsEditing({ ...isEditing, [field]: true });
    if (attorney) {
      // Handle nested location fields
      if (field.startsWith('location.')) {
        const locationField = field.split('.')[1];
        setFormData({ ...formData, [field]: attorney.location?.[locationField as keyof typeof attorney.location] });
      } else {
        setFormData({ ...formData, [field]: attorney[field as keyof typeof attorney] });
      }
    }
  };

  const handleSave = async (field: string) => {
    if (!attorney) return;
    
    try {
      // Handle nested location fields
      if (field.startsWith('location.')) {
        const locationField = field.split('.')[1];
        await updateAttorney.mutateAsync({
          id: attorney._id,
          location: {
            [locationField]: formData[field],
          },
        });
      } else {
        await updateAttorney.mutateAsync({
          id: attorney._id,
          [field]: formData[field],
        });
      }
      setIsEditing({ ...isEditing, [field]: false });
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const handleCancel = (field: string) => {
    setIsEditing({ ...isEditing, [field]: false });
    setFormData({ ...formData, [field]: "" });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const EditableField = ({ 
    label, 
    field, 
    value, 
    icon: Icon, 
    type = "text",
    placeholder 
  }: {
    label: string;
    field: string;
    value: any;
    icon: any;
    type?: string;
    placeholder?: string;
  }) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-slate-500" />
            <label className="text-sm font-medium text-slate-700">{label}</label>
          </div>
          {!isEditing[field] && (
            <button
              onClick={() => handleEdit(field)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Edit
            </button>
          )}
        </div>
        
        {isEditing[field] ? (
          <div className="space-y-2">
            <input
              autoFocus
              type={type}
              value={formData[field] || ""}
              onChange={(e) => handleInputChange(field, type === "number" ? Number(e.target.value) : e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave(field);
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  handleCancel(field);
                }
              }}
              placeholder={placeholder}
              className="w-full px-3 py-2 text-slate-900 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <div className="flex gap-2">
              <button
                onMouseDown={(e) => e.preventDefault()} // Prevent input from losing focus
                onClick={() => handleSave(field)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                disabled={updateAttorney.isPending}
              >
                <Save className="h-3 w-3" />
                {updateAttorney.isPending ? 'Saving...' : 'Save'}
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()} // Prevent input from losing focus
                onClick={() => handleCancel(field)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 border border-slate-300 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="px-3 py-2 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-900">
              {value || <span className="text-slate-400">Not set</span>}
            </span>
          </div>
        )}
      </div>
    );
  };

  if (!attorney) {
    return (
      <AttorneyLayout title="Settings" attorneyId={attorneyId}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-500">Loading your settings...</p>
          </div>
        </div>
      </AttorneyLayout>
    );
  }

  return (
    <AttorneyLayout title="Settings" attorneyId={attorneyId}>
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Profile Section */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-4">
              <ProfilePictureUpload 
                attorney={attorney}
                onUploadSuccess={() => {
                  // Refetch attorney data to get the new profile picture
                  attorneyQuery.refetch();
                }}
              />
              <div>
                <CardTitle className="text-slate-900">{attorney.fullName}</CardTitle>
                <CardDescription className="text-slate-600">{attorney.email}</CardDescription>
                {attorney.isVerified && (
                  <div className="flex items-center gap-1 mt-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-600">Verified Attorney</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-slate-900">Personal Information</CardTitle>
              <CardDescription className="text-slate-600">Update your basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <EditableField
                label="Full Name"
                field="fullName"
                value={attorney.fullName}
                icon={User}
                placeholder="Enter your full name"
              />
              
              <EditableField
                label="Email Address"
                field="email"
                value={attorney.email}
                icon={Mail}
                type="email"
                placeholder="Enter your email"
              />
              
              <EditableField
                label="Phone Number"
                field="phoneNumber"
                value={attorney.phoneNumber}
                icon={Phone}
                type="tel"
                placeholder="Enter your phone number"
              />
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-slate-900">Professional Information</CardTitle>
              <CardDescription className="text-slate-600">Manage your professional details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <EditableField
                label="Years of Experience"
                field="yearsOfExperience"
                value={attorney.yearsOfExperience}
                icon={Briefcase}
                type="number"
                placeholder="Enter years of experience"
              />
              
              <EditableField
                label="Hourly Rate ($)"
                field="hourlyRate"
                value={attorney.hourlyRate}
                icon={DollarSign}
                type="number"
                placeholder="Enter your hourly rate"
              />
              
              <EditableField
                label="Bar Association ID"
                field="barAssociationId"
                value={attorney.barAssociationId}
                icon={Shield}
                placeholder="Enter your bar association ID"
              />
            </CardContent>
          </Card>
        </div>

        {/* Location Information */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-slate-900">Location Information</CardTitle>
            <CardDescription className="text-slate-600">Update your location details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EditableField
                label="City"
                field="location.city"
                value={attorney.location?.city}
                icon={MapPin}
                placeholder="Enter city"
              />
              
              <EditableField
                label="State"
                field="location.state"
                value={attorney.location?.state}
                icon={MapPin}
                placeholder="Enter state"
              />
              
              <EditableField
                label="Zip Code"
                field="location.zipCode"
                value={attorney.location?.zipCode}
                icon={MapPin}
                placeholder="Enter zip code"
              />
            </div>
          </CardContent>
        </Card>

        {/* Practice Areas */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-slate-900">Practice Areas</CardTitle>
            <CardDescription className="text-slate-600">Manage your areas of expertise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attorney.practiceAreas?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {attorney.practiceAreas.map((area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">No practice areas set</p>
              )}
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Edit Practice Areas
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AttorneyLayout>
  );
}