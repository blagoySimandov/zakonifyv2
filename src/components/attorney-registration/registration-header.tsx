"use client";

import Image from "next/image";
import { REGISTRATION_MESSAGES } from "@/messages";

export function RegistrationHeader() {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-45 h-45 rounded-2xl mb-6 p-3">
        <Image
          src="/logo.png"
          alt="Zakonify Logo"
          width={100}
          height={100}
          className="w-full h-full object-contain"
        />
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

