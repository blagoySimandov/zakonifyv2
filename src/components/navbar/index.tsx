"use client";

import Link from "next/link";
import Image from "next/image";
import { useNavbarState } from "./hooks";
import { NAVBAR_CONSTANTS } from "./constants";
import { NAVBAR_MESSAGES } from "@/messages";
import { Menu, X, Bell } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

interface NavbarProps {
  variant?: "default" | "transparent" | "minimal";
  showNavigation?: boolean;
  showUserSection?: boolean;
  className?: string;
}

export function Navbar({ 
  variant = "default", 
  showNavigation = true, 
  showUserSection = true,
  className = ""
}: NavbarProps) {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useNavbarState();

  // Variant-specific styling
  const getNavbarClasses = () => {
    const baseClasses = "border-gray-100";
    
    switch (variant) {
      case "transparent":
        return `absolute top-0 left-0 right-0 z-20 bg-transparent ${baseClasses}`;
      case "minimal":
        return `bg-white border-b ${baseClasses}`;
      case "default":
      default:
        return `bg-white border-b ${baseClasses}`;
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case "transparent":
        return {
          brand: "text-white hover:text-white/80",
          nav: "text-white/90 hover:text-white",
          mobile: "text-gray-600 hover:text-gray-900" // Mobile menu is always on white background
        };
      case "minimal":
      case "default":
      default:
        return {
          brand: "text-gray-900 hover:text-legal-600",
          nav: "text-gray-600 hover:text-gray-900",
          mobile: "text-gray-600 hover:text-gray-900"
        };
    }
  };

  const textClasses = getTextClasses();

  const renderBrandLogo = () => (
    <Link
      href="/"
      className={`flex items-center gap-2 transition-colors ${textClasses.brand}`}
      onClick={closeMobileMenu}
    >
      <Image 
        src="/logo.png" 
        alt="Zakonify Logo" 
        width={32} 
        height={32} 
        className="w-8 h-8"
        priority
      />
      <span className="text-xl font-bold">
        {NAVBAR_MESSAGES.BRAND_NAME}
      </span>
    </Link>
  );

  const renderMobileMenuToggle = () => (
    <button
      onClick={toggleMobileMenu}
      className={`md:hidden p-2 focus:outline-none transition-colors ${
        variant === "transparent" ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-gray-900"
      }`}
      aria-label="Toggle mobile menu"
    >
      {isMobileMenuOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <Menu className="w-6 h-6" />
      )}
    </button>
  );

  const renderNavigationLinks = () => {
    if (!showNavigation) return null;
    
    return (
      <nav className="hidden md:flex items-center space-x-6">
        {NAVBAR_CONSTANTS.NAVIGATION_ITEMS.map((navigationItem) => (
          <Link
            key={navigationItem.href}
            href={navigationItem.href}
            className={`text-sm font-medium transition-colors ${textClasses.nav}`}
          >
            {NAVBAR_MESSAGES.NAVIGATION[navigationItem.label as keyof typeof NAVBAR_MESSAGES.NAVIGATION]}
          </Link>
        ))}
      </nav>
    );
  };

  const renderUserSection = () => {
    if (!showUserSection) return null;

    // For transparent variant, show auth links instead of user section
    if (variant === "transparent") {
      return (
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                Регистрация
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      );
    }

    return (
      <div className="hidden md:flex items-center space-x-4">
        <SignedOut>
          <Link
            href="/register"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {NAVBAR_MESSAGES.ACTIONS.JOIN_AS_ATTORNEY}
          </Link>
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Вход
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={NAVBAR_MESSAGES.ACTIONS.NOTIFICATIONS}
          >
            <Bell className="w-5 h-5" />
          </button>
          <UserButton />
        </SignedIn>
      </div>
    );
  };

  const renderMobileMenu = () => {
    if (!showNavigation && !showUserSection) return null;

    return (
      <div
        className={`md:hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
      >
        <div className="px-6 py-4 space-y-4 bg-gray-50 border-t border-gray-100">
          {showNavigation && NAVBAR_CONSTANTS.NAVIGATION_ITEMS.map((navigationItem) => (
            <Link
              key={navigationItem.href}
              href={navigationItem.href}
              className={`block transition-colors ${textClasses.mobile}`}
              onClick={closeMobileMenu}
            >
              {NAVBAR_MESSAGES.NAVIGATION[navigationItem.label as keyof typeof NAVBAR_MESSAGES.NAVIGATION]}
            </Link>
          ))}

          {showUserSection && variant !== "transparent" && (
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <SignedOut>
                <div className="space-y-2">
                  <SignInButton mode="modal">
                    <button className="block text-gray-600 hover:text-gray-900 transition-colors w-full text-left">
                      Вход
                    </button>
                  </SignInButton>
                  <Link
                    href="/register"
                    className="block text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    {NAVBAR_MESSAGES.ACTIONS.JOIN_AS_ATTORNEY}
                  </Link>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center space-x-3">
                  <UserButton />
                  <span className="text-gray-900 font-medium">{NAVBAR_MESSAGES.ACTIONS.PROFILE}</span>
                </div>
              </SignedIn>
            </div>
          )}

          {variant === "transparent" && (
            <div className="pt-4 border-t border-gray-200">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="block text-gray-600 hover:text-gray-900 transition-colors w-full text-left">
                    Регистрация
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center space-x-3">
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <nav className={`${getNavbarClasses()} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {renderBrandLogo()}
          {renderNavigationLinks()}
          {renderUserSection()}
          {renderMobileMenuToggle()}
        </div>
      </div>
      {renderMobileMenu()}
    </nav>
  );
}
