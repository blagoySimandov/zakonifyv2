"use client";

import { useState } from "react";
import { useReviewForm } from "./hooks";
import { REVIEW_FORM_CONSTANTS } from "./constants";
import { REVIEW_FORM_MESSAGES } from "./messages";
import { Star, Send, X, CheckCircle } from "lucide-react";

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
  const {
    formData,
    errors,
    isSubmitting,
    isSubmitted,
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
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {REVIEW_FORM_CONSTANTS.LABELS.RATING} *
      </label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => updateFormData("rating", star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-1 transition-colors">
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredRating || formData.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-3 text-sm text-gray-600">
          {
            REVIEW_FORM_CONSTANTS.RATING_LABELS[
              (formData.rating as 0 | 1 | 2 | 3 | 4 | 5) ?? 0
            ]
          }
        </span>
      </div>
      {errors.rating && (
        <p className="text-red-600 text-sm mt-1">{errors.rating[0]}</p>
      )}
    </div>
  );

  const renderSuccessState = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-green-800 mb-2">
        {REVIEW_FORM_MESSAGES.SUCCESS.SUBMITTED}
      </h3>
      <p className="text-green-700 mb-6">
        {REVIEW_FORM_MESSAGES.SUCCESS.THANK_YOU}
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
        {REVIEW_FORM_CONSTANTS.BUTTONS.CLOSE}
      </button>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-md w-full mx-4">
          <div className="p-6">{renderSuccessState()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {REVIEW_FORM_CONSTANTS.TITLE}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              {REVIEW_FORM_MESSAGES.INFO.REVIEWING_FOR}{" "}
              <span className="font-medium">{attorneyName}</span>
            </p>
          </div>

          {errors._general && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors._general[0]}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {REVIEW_FORM_CONSTANTS.LABELS.CLIENT_NAME} *
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => updateFormData("clientName", e.target.value)}
                placeholder={REVIEW_FORM_CONSTANTS.PLACEHOLDERS.CLIENT_NAME}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
              {errors.clientName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.clientName[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {REVIEW_FORM_CONSTANTS.LABELS.CLIENT_EMAIL} *
              </label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => updateFormData("clientEmail", e.target.value)}
                placeholder={REVIEW_FORM_CONSTANTS.PLACEHOLDERS.CLIENT_EMAIL}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
              {errors.clientEmail && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.clientEmail[0]}
                </p>
              )}
            </div>

            {renderRatingSelector()}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {REVIEW_FORM_CONSTANTS.LABELS.COMMENT} *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => updateFormData("comment", e.target.value)}
                placeholder={REVIEW_FORM_CONSTANTS.PLACEHOLDERS.COMMENT}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isSubmitting}
              />
              <div className="flex justify-between mt-1">
                {errors.comment ? (
                  <p className="text-red-600 text-sm">{errors.comment[0]}</p>
                ) : (
                  <div />
                )}
                <p className="text-gray-500 text-sm">
                  {formData.comment.length}/
                  {REVIEW_FORM_CONSTANTS.LIMITS.COMMENT_MAX}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50">
                {REVIEW_FORM_CONSTANTS.BUTTONS.CANCEL}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-400 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {REVIEW_FORM_CONSTANTS.BUTTONS.SUBMITTING}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {REVIEW_FORM_CONSTANTS.BUTTONS.SUBMIT}
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
