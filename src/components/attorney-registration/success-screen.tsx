"use client";

import { CheckCircle } from "lucide-react";
import { REGISTRATION_MESSAGES } from "@/messages";

export function SuccessScreen() {
  return (
    <div className="h-[90vh] bg-gradient-to-br from-slate-50 to-primary-50/30 py-8 px-4 flex items-center justify-center overflow-hidden">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {REGISTRATION_MESSAGES.SUCCESS.SUBMITTED}
          </h2>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {REGISTRATION_MESSAGES.INFO.VERIFICATION_PENDING}
          </p>
          <div className="bg-primary-50 rounded-2xl p-6">
            <p className="text-primary-700 font-medium">
              {REGISTRATION_MESSAGES.INFO.EMAIL_VERIFICATION}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}