"use client";

import Link from "next/link";
import { ACTION_BUTTONS_CONSTANTS } from "./constants";
import { ACTION_BUTTONS_MESSAGES } from "./messages";

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
    const baseClasses = ACTION_BUTTONS_CONSTANTS.BASE_CLASSES;
    
    if (variant === "primary") {
      return `${baseClasses} ${ACTION_BUTTONS_CONSTANTS.PRIMARY_CLASSES}`;
    }
    
    return `${baseClasses} ${ACTION_BUTTONS_CONSTANTS.SECONDARY_CLASSES}`;
  };

  return (
    <div className={ACTION_BUTTONS_CONSTANTS.CONTAINER_CLASSES}>
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