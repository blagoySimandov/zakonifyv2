"use client";

import Link from "next/link";
import { Scale } from "lucide-react";
import { NAVBAR_MESSAGES } from "../../navbar/messages";
import { LOGIN_MESSAGES } from "../messages";

export function LoginNavbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              {NAVBAR_MESSAGES.BRAND_NAME}
            </span>
          </Link>

          {/* Sign up link */}
          <div className="flex items-center gap-4">
            <Link
              href="/signup"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              {LOGIN_MESSAGES.SIGN_UP}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}