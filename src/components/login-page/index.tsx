"use client";

import { Users, Scale } from "lucide-react";
import { LoginOptionCard } from "./login-option-card";
import { LOGIN_MESSAGES } from "./messages";
import { LOGIN_TYPES } from "./constants";
import { useLoginPage } from "./hooks";

export function LoginPage() {
  const { handleLogin } = useLoginPage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {LOGIN_MESSAGES.PAGE_TITLE}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {LOGIN_MESSAGES.PAGE_SUBTITLE}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          <LoginOptionCard
            title={LOGIN_MESSAGES.CLIENT_LOGIN_TITLE}
            description={LOGIN_MESSAGES.CLIENT_LOGIN_DESCRIPTION}
            buttonText={LOGIN_MESSAGES.CLIENT_LOGIN_BUTTON}
            icon={Users}
            onClick={() => handleLogin(LOGIN_TYPES.CLIENT)}
          />

          <div className="flex items-center justify-center">
            <div className="hidden md:block w-px h-32 bg-gray-200"></div>
            <div className="md:hidden w-32 h-px bg-gray-200"></div>
            <span className="absolute bg-gray-50 px-4 py-2 text-sm text-gray-500 font-medium">
              {LOGIN_MESSAGES.OR_DIVIDER}
            </span>
          </div>

          <LoginOptionCard
            title={LOGIN_MESSAGES.ATTORNEY_LOGIN_TITLE}
            description={LOGIN_MESSAGES.ATTORNEY_LOGIN_DESCRIPTION}
            buttonText={LOGIN_MESSAGES.ATTORNEY_LOGIN_BUTTON}
            icon={Scale}
            onClick={() => handleLogin(LOGIN_TYPES.ATTORNEY)}
          />
        </div>
      </div>
    </div>
  );
}