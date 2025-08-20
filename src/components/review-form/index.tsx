"use client";

import { useState } from "react";
import { useReviewForm } from "./hooks";
import { ATTORNEY_PROFILE_MESSAGES } from "@/messages";
import { Star, Send, X, CheckCircle, LogIn } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";

interface ReviewFormProps {
  attorneyId: string;
  attorneyName: string;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export function ReviewForm({
  attorneyId,
  attorneyName,
  onClose,
  onSubmitSuccess,
}: ReviewFormProps) {
  const { signIn } = useSignIn();
  const {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
    isSignedIn,
    user,
    updateFormData,
    submitReview,
  } = useReviewForm(attorneyId);

  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitReview();
    if (success && onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  const renderRatingSelector = () => (
    <div className="mb-8">
      <label className="block text-lg font-semibold text-gray-900 mb-4">
        {ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.LABELS.RATING} *
      </label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => updateFormData("rating", star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-2 transition-all duration-200 hover:scale-110"
          >
            <Star
              className={`w-10 h-10 transition-all duration-200 ${
                star <= (hoveredRating || formData.rating)
                  ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-4 text-base text-gray-700 font-medium">
          {
            ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.RATING_LABELS[
              (formData.rating as 0 | 1 | 2 | 3 | 4 | 5) ?? 0
            ]
          }
        </span>
      </div>
      {errors.rating && (
        <p className="text-red-500 text-sm mt-3 font-medium">{errors.rating[0]}</p>
      )}
    </div>
  );

  const renderLoginPrompt = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <LogIn className="w-10 h-10 text-primary-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Влезте в профила си
      </h3>
      <p className="text-gray-600 mb-8 text-lg">
        Трябва да влезете в профила си, за да можете да оставите отзив за този адвокат.
      </p>
      <div className="flex gap-4">
        <button
          onClick={onClose}
          className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-semibold flex-1"
        >
          {ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.BUTTONS.CANCEL}
        </button>
        <button
          onClick={() => signIn?.({ redirectUrl: window.location.href })}
          className="px-8 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-700/30 transform hover:-translate-y-0.5 flex items-center gap-3 flex-1 justify-center"
        >
          <LogIn className="w-5 h-5" />
          Вход
        </button>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-primary-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.SUCCESS.SUBMITTED}
      </h3>
      <p className="text-gray-600 mb-8 text-lg">
        {ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.SUCCESS.THANK_YOU}
      </p>
      <button
        onClick={onClose}
        className="px-8 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-700/30 transform hover:-translate-y-0.5"
      >
        {ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.BUTTONS.CLOSE}
      </button>
    </div>
  );

  if (!isSignedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full">
          <div className="p-8">{renderLoginPrompt()}</div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full">
          <div className="p-8">{renderSuccessState()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.TITLE}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
            <p className="text-base text-gray-700 mb-3">
              {ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.REVIEWING_FOR}{" "}
              <span className="font-semibold text-gray-900">{attorneyName}</span>
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  {user?.firstName?.charAt(0)?.toUpperCase() || user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.emailAddresses[0]?.emailAddress
                  }
                </p>
                <p className="text-xs text-gray-500">Вашият отзив ще бъде публичен</p>
              </div>
            </div>
          </div>

          {errors._general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-700 text-sm font-medium">{errors._general[0]}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {renderRatingSelector()}

            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                {ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.LABELS.COMMENT} *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => updateFormData("comment", e.target.value)}
                placeholder={ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.PLACEHOLDERS.COMMENT}
                rows={5}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-base transition-all duration-200"
                disabled={isSubmitting}
              />
              <div className="flex justify-between mt-3">
                {errors.comment ? (
                  <p className="text-red-500 text-sm font-medium">{errors.comment[0]}</p>
                ) : (
                  <div />
                )}
                <p className="text-gray-500 text-sm font-medium">
                  {formData.comment.length}/
                  {ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.VALIDATION.COMMENT_MAX}
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-semibold disabled:opacity-50 flex-1"
              >
                {ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.BUTTONS.CANCEL}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all duration-200 font-semibold shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-700/30 transform hover:-translate-y-0.5 disabled:bg-primary-400 disabled:shadow-none disabled:transform-none flex items-center gap-3 flex-1 justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.BUTTONS.SUBMITTING}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {ATTORNEY_PROFILE_MESSAGES.REVIEW_FORM.BUTTONS.SUBMIT}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
