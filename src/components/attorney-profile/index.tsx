"use client";

import { useState } from "react";
import { useAttorneyProfile } from "./hooks";
import { ReviewForm } from "../review-form";
import { ConsultationBooking } from "../consultation-booking";
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
} from "lucide-react";

interface AttorneyProfileProps {
  attorneyId: string;
}

export function AttorneyProfile({ attorneyId }: AttorneyProfileProps) {
  const { attorney, reviews, ratingStats, isLoading, error, refetchAll } =
    useAttorneyProfile(attorneyId);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const renderLoadingState = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center gap-3">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-lg text-gray-600">
          Loading attorney profile...
        </span>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">Attorney not found</div>
        <p className="text-gray-600">
          The attorney profile you’re looking for doesn’t exist.
        </p>
      </div>
    </div>
  );

  const renderProfileHeader = () => (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
              {attorney?.profileImage ? (
                <img
                  src={attorney.profileImage}
                  alt={attorney.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                  <Scale className="w-12 h-12 text-blue-500" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {attorney?.fullName}
                </h1>
                {attorney?.isVerified && (
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 font-medium">
                      Verified Attorney
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {attorney?.location.city}, {attorney?.location.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{attorney?.yearsOfExperience} years experience</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(ratingStats.averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {ratingStats.averageRating > 0
                      ? `${ratingStats.averageRating} (${ratingStats.totalReviews} review${ratingStats.totalReviews !== 1 ? "s" : ""})`
                      : "No reviews yet"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Book Consultation
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        {attorney?.bio || "No biography provided."}
      </p>
      {attorney?.education && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
          <p className="text-gray-700">{attorney.education}</p>
        </div>
      )}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Bar Association ID</h3>
        <p className="text-gray-700">{attorney?.barAssociationId}</p>
      </div>
    </div>
  );

  const renderPracticeAreasSection = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Practice Areas</h2>
      <div className="flex flex-wrap gap-2">
        {attorney?.practiceAreas.map((area) => (
          <span
            key={area}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {area}
          </span>
        ))}
      </div>
    </div>
  );

  const renderPricingSection = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing</h2>

      <div className="mb-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900">Hourly Consultation</h3>
            <p className="text-gray-600 text-sm">Standard legal consultation</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${attorney?.hourlyRate}
            </div>
            <div className="text-sm text-gray-600">per hour</div>
          </div>
        </div>
      </div>

      {attorney?.fixedFeePackages && attorney.fixedFeePackages.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            Fixed Fee Packages
          </h3>
          <div className="space-y-3">
            {attorney.fixedFeePackages.map((pkg, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                  <p className="text-gray-600 text-sm">{pkg.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    ${pkg.price}
                  </div>
                  <div className="text-sm text-gray-600">fixed fee</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderContactSection = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Contact Information
      </h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-400" />
          <span className="text-gray-700">{attorney?.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <span className="text-gray-700">
            {attorney?.location.city}, {attorney?.location.state},{" "}
            {attorney?.location.country}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className="text-gray-700">Available for consultations</span>
        </div>
      </div>
    </div>
  );

  const renderReviewsSection = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Reviews & Ratings</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsReviewFormOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            Write Review
          </button>
          {ratingStats.totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(ratingStats.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm">
                {ratingStats.averageRating} out of 5 ({ratingStats.totalReviews}{" "}
                review{ratingStats.totalReviews !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-500 mb-4">
            Be the first to review this attorney
          </p>
          <button
            onClick={() => setIsReviewFormOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Write the first review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {review.clientName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {review.clientName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (isLoading) return renderLoadingState();
  if (error || !attorney) return renderErrorState();

  return (
    <div className="min-h-screen bg-gray-50">
      {renderProfileHeader()}

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {renderAboutSection()}
            {renderPracticeAreasSection()}
            {renderReviewsSection()}
          </div>

          <div className="lg:col-span-1">
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
            refetchAll();
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
    </div>
  );
}
