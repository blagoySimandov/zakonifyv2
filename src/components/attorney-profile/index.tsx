"use client";

import { useState } from "react";
import Image from "next/image";
import { useAttorneyProfile } from "./hooks";
import { ReviewForm } from "../review-form";
import { ConsultationBooking } from "../consultation-booking";
import { PackageDetailsModal } from "./package-details-modal";
import { PRACTICE_AREA_LABELS, PracticeArea } from "@/constants";
import { ATTORNEY_PROFILE_MESSAGES } from "@/messages";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Star,
  MapPin,
  Clock,
  Mail,
  CheckCircle,
  Award,
  Scale,
  Calendar,
  MessageCircle,
  Loader,
  Plus,
  ChevronRight,
  Shield,
  Phone,
  Globe,
} from "lucide-react";

interface AttorneyProfileProps {
  attorneyId: string;
}

export function AttorneyProfile({ attorneyId }: AttorneyProfileProps) {
  const { attorney, reviews, ratingStats, isLoading, error } =
    useAttorneyProfile(attorneyId);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{name: string, description: string, price: number} | null>(null);
  
  const profileImageUrl = useQuery(
    api.storage.getUrl,
    attorney?.profileImageStorageId 
      ? { storageId: attorney.profileImageStorageId }
      : "skip"
  );

  const renderLoadingState = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
          <Loader className="w-6 h-6 text-white animate-spin" />
        </div>
        <span className="text-lg font-medium text-gray-700">
          {ATTORNEY_PROFILE_MESSAGES.LOADING.PROFILE}
        </span>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Scale className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">{ATTORNEY_PROFILE_MESSAGES.ERROR.NOT_FOUND}</h2>
        <p className="text-gray-600 leading-relaxed">
          {ATTORNEY_PROFILE_MESSAGES.ERROR.NOT_FOUND_DESCRIPTION}
        </p>
      </div>
    </div>
  );

  const renderProfileHeader = () => (
    <div className="bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="relative px-8 pt-12 pb-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg ring-4 ring-white">
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt={attorney?.fullName || "Profile"}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-50 flex items-center justify-center">
                    <Scale className="w-16 h-16 text-primary-600" />
                  </div>
                )}
              </div>
              {attorney?.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-success-600 rounded-full flex items-center justify-center ring-4 ring-white">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            <div className="mb-8">
              <h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">
                {attorney?.fullName}
              </h1>
              
              <div className="flex items-center justify-center gap-6 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">
                    {attorney?.location.city}, {attorney?.location.state}
                  </span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">{attorney?.yearsOfExperience} {ATTORNEY_PROFILE_MESSAGES.INFO.YEARS_SUFFIX}</span>
                </div>
              </div>

              {ratingStats.totalReviews > 0 && (
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(ratingStats.averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium text-gray-900">
                    {ratingStats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-600">
                    ({ratingStats.totalReviews} {ratingStats.totalReviews !== 1 ? ATTORNEY_PROFILE_MESSAGES.INFO.REVIEW_COUNT_PLURAL : ATTORNEY_PROFILE_MESSAGES.INFO.REVIEW_COUNT_SINGULAR})
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-8 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-700/30 transform hover:-translate-y-0.5"
              >
                {ATTORNEY_PROFILE_MESSAGES.ACTIONS.BOOK_CONSULTATION}
              </button>
              <button className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-semibold">
                {ATTORNEY_PROFILE_MESSAGES.ACTIONS.SEND_MESSAGE}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Scale className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">{ATTORNEY_PROFILE_MESSAGES.SECTIONS.ABOUT}</h2>
        </div>
        
        <div className="space-y-6">
          <p className="text-gray-700 text-lg leading-relaxed">
            {attorney?.bio || ATTORNEY_PROFILE_MESSAGES.INFO.NO_BIOGRAPHY}
          </p>
          
          {attorney?.education && (
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{ATTORNEY_PROFILE_MESSAGES.SECTIONS.EDUCATION}</h3>
              </div>
              <p className="text-gray-700 ml-11">{attorney.education}</p>
            </div>
          )}
          
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-success-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{ATTORNEY_PROFILE_MESSAGES.SECTIONS.BAR_ASSOCIATION}</h3>
            </div>
            <p className="text-gray-700 ml-11 font-mono text-sm bg-white px-3 py-2 rounded-lg inline-block">
              {attorney?.barAssociationId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPracticeAreasSection = () => (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-6">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Scale className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">{ATTORNEY_PROFILE_MESSAGES.SECTIONS.PRACTICE_AREAS}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {attorney?.practiceAreas.map((area) => (
            <div
              key={area}
              className="flex items-center gap-3 p-4 bg-primary-50 rounded-2xl border border-primary-100"
            >
              <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
              <span className="text-primary-800 font-medium">
                {PRACTICE_AREA_LABELS[area as PracticeArea]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPricingSection = () => (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-6">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-success-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">{ATTORNEY_PROFILE_MESSAGES.SECTIONS.PRICING}</h2>
        </div>

        <div className="space-y-4">
          <div className="p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{ATTORNEY_PROFILE_MESSAGES.SECTIONS.HOURLY_CONSULTATION}</h3>
                </div>
                <p className="text-gray-600 ml-11">{ATTORNEY_PROFILE_MESSAGES.SECTIONS.HOURLY_CONSULTATION_DESCRIPTION}</p>
              </div>
              <div className="text-right ml-6">
                <div className="text-3xl font-bold text-gray-900">
                  ${attorney?.hourlyRate}
                </div>
                <div className="text-sm text-gray-600 font-medium">{ATTORNEY_PROFILE_MESSAGES.INFO.PER_HOUR}</div>
              </div>
            </div>
          </div>

          {attorney?.fixedFeePackages && attorney.fixedFeePackages.length > 0 && (
            <div className="pt-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-4 ml-2">
                {ATTORNEY_PROFILE_MESSAGES.SECTIONS.FIXED_FEE_PACKAGES}
              </h3>
              <div className="space-y-4">
                {attorney.fixedFeePackages.map((pkg, index) => (
                  <div
                    key={index}
                    className="p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2 truncate">{pkg.name}</h4>
                        <div className="text-gray-600 leading-relaxed">
                          <p className="overflow-hidden line-clamp-3">
                            {pkg.description}
                          </p>
                          <button
                            onClick={() => setSelectedPackage(pkg)}
                            className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                          >
                            <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                            {ATTORNEY_PROFILE_MESSAGES.ACTIONS.SHOW_MORE}
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold text-gray-900">
                          ${pkg.price}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">{ATTORNEY_PROFILE_MESSAGES.INFO.FIXED_FEE}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-6">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">{ATTORNEY_PROFILE_MESSAGES.SECTIONS.CONTACT_INFORMATION}</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Mail className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-gray-700 font-medium">{attorney?.email}</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-gray-700 font-medium">
              {attorney?.location.city}, {attorney?.location.state}, {attorney?.location.country}
            </span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-gray-700 font-medium">{ATTORNEY_PROFILE_MESSAGES.INFO.AVAILABLE_FOR_CONSULTATIONS}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewsSection = () => (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">{ATTORNEY_PROFILE_MESSAGES.SECTIONS.REVIEWS_RATINGS}</h2>
          </div>
          <button
            onClick={() => setIsReviewFormOpen(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-700/30 transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {ATTORNEY_PROFILE_MESSAGES.ACTIONS.WRITE_REVIEW}
          </button>
        </div>

        {ratingStats.totalReviews > 0 && (
          <div className="flex items-center justify-center gap-4 p-6 bg-gray-50 rounded-2xl mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {ratingStats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(ratingStats.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 font-medium">
                {ATTORNEY_PROFILE_MESSAGES.INFO.OUT_OF_FIVE} ({ratingStats.totalReviews}{" "}
                {ratingStats.totalReviews !== 1 ? ATTORNEY_PROFILE_MESSAGES.INFO.REVIEW_COUNT_PLURAL : ATTORNEY_PROFILE_MESSAGES.INFO.REVIEW_COUNT_SINGULAR})
              </span>
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {ATTORNEY_PROFILE_MESSAGES.INFO.NO_REVIEWS}
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              {ATTORNEY_PROFILE_MESSAGES.INFO.NO_REVIEWS_DESCRIPTION}
            </p>
            <button
              onClick={() => setIsReviewFormOpen(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all duration-200 font-semibold"
            >
              {ATTORNEY_PROFILE_MESSAGES.ACTIONS.WRITE_FIRST_REVIEW}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-6 bg-gray-50 rounded-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                    {review.clientName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900 text-lg">
                          {review.clientName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString("bg-BG", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) return renderLoadingState();
  if (error || !attorney) return renderErrorState();

  return (
    <div className="min-h-screen bg-gray-50/50">
      {renderProfileHeader()}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {renderAboutSection()}
            {renderPracticeAreasSection()}
            {renderReviewsSection()}
          </div>

          <div className="lg:col-span-1 space-y-8">
            {renderPricingSection()}
            {renderContactSection()}
          </div>
        </div>
      </div>

      {isReviewFormOpen && (
        <ReviewForm
          attorneyId={attorneyId}
          attorneyName={attorney.fullName}
          onClose={() => setIsReviewFormOpen(false)}
          onSubmitSuccess={() => {
            setIsReviewFormOpen(false);
            // Convex automatically refetches related queries after mutations
          }}
        />
      )}

      {isBookingOpen && (
        <ConsultationBooking
          attorney={attorney}
          onClose={() => setIsBookingOpen(false)}
          onBookingSuccess={() => {
            setIsBookingOpen(false);
          }}
        />
      )}

      {selectedPackage && (
        <PackageDetailsModal
          package={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </div>
  );
}
