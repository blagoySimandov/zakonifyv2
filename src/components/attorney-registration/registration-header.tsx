"use client";

import { Scale } from "lucide-react";
import { REGISTRATION_MESSAGES } from "./messages";

export function RegistrationHeader() {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
        <Scale className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-semibold text-gray-900 mb-3">
        {REGISTRATION_MESSAGES.HEADER.TITLE}
      </h1>
      <p className="text-gray-600 text-lg">
        {REGISTRATION_MESSAGES.HEADER.SUBTITLE}
      </p>
    </div>
  );
}