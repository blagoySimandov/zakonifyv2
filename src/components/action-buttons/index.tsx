"use client";

import Link from "next/link";

interface ActionButton {
  text: string;
  onClick?: () => void;
  href?: string;
  variant: "primary" | "secondary";
}

interface ActionButtonsProps {
  buttons: ActionButton[];
}

export function ActionButtons({ buttons }: ActionButtonsProps) {
  const getButtonClasses = (variant: ActionButton["variant"]) => {
    const baseClasses = "px-6 py-2 rounded-lg font-medium transition-colors";

    if (variant === "primary") {
      return `${baseClasses} bg-teal-500 hover:bg-teal-600 text-white`;
    }

    return `${baseClasses} bg-gray-100 hover:bg-gray-200 text-gray-700 border`;
  };

  return (
    <div className="flex gap-3">
      {buttons.map((button, index) => {
        if (button.href) {
          return (
            <Link
              key={index}
              href={button.href}
              className={getButtonClasses(button.variant)}
            >
              {button.text}
            </Link>
          );
        }

        return (
          <button
            key={index}
            onClick={button.onClick}
            className={getButtonClasses(button.variant)}
          >
            {button.text}
          </button>
        );
      })}
    </div>
  );
}
