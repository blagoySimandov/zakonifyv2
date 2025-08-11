"use client";

import { useState, useRef, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const dropdownVariants = cva(
  "relative w-full min-w-0",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
      width: {
        auto: "w-auto min-w-[180px]",
        full: "w-full",
        compact: "w-48",
        xs: "w-32",
        sm: "w-40",
        md: "w-56",
        lg: "w-72",
      },
    },
    defaultVariants: {
      size: "md",
      width: "full",
    },
  }
);

const triggerVariants = cva(
  "w-full flex items-center justify-between px-4 py-3 text-left bg-white border border-gray-300 rounded-xl shadow-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  {
    variants: {
      size: {
        sm: "px-3 py-2 text-sm rounded-lg",
        md: "px-4 py-3 text-base rounded-xl",
        lg: "px-5 py-4 text-lg rounded-xl",
      },
      state: {
        default: "text-gray-700",
        placeholder: "text-gray-400",
        open: "border-blue-500 ring-2 ring-blue-500",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
);

const dropdownMenuVariants = cva(
  "absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const optionVariants = cva(
  "w-full px-4 py-3 text-left transition-colors duration-150 hover:bg-gray-50 flex items-center justify-between",
  {
    variants: {
      size: {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base",
        lg: "px-5 py-4 text-lg",
      },
      state: {
        default: "text-gray-700",
        selected: "text-blue-600 bg-blue-50",
        hover: "bg-gray-50",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  }
);

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps extends VariantProps<typeof dropdownVariants> {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function Dropdown({
  options,
  value = "",
  placeholder,
  onChange,
  className,
  disabled = false,
  size,
  width,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption?.label || placeholder;
  const isPlaceholder = !selectedOption;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={cn(dropdownVariants({ size, width }), className)}
    >
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          triggerVariants({
            size,
            state: isOpen ? "open" : isPlaceholder ? "placeholder" : "default",
          }),
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform duration-200 text-gray-400",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && !disabled && (
        <div
          className={dropdownMenuVariants({ size })}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionSelect(option.value)}
                className={cn(
                  optionVariants({
                    size,
                    state: isSelected ? "selected" : "default",
                  })
                )}
                role="option"
                aria-selected={isSelected}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}