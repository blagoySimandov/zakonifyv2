"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, Check, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Fuse from "fuse.js";

const dropdownVariants = cva("relative w-full min-w-0", {
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
});

const triggerVariants = cva(
  "w-full flex items-center justify-between px-4 py-3 text-left bg-white border border-gray-300 rounded-xl shadow-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
  {
    variants: {
      size: {
        sm: "px-3 py-2 text-sm rounded-lg",
        md: "px-4 py-3 text-base rounded-xl",
        lg: "px-5 py-4 text-lg rounded-xl",
      },
      state: {
        default: "text-gray-700",
        placeholder: "text-gray-500",
        open: "border-primary-500 ring-2 ring-primary-500 text-gray-700",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  },
);

const dropdownMenuVariants = cva(
  "absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-62 overflow-hidden",
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
  },
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
        selected: "text-primary-600 bg-primary-50",
        hover: "bg-gray-50",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
    },
  },
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
  clearable?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
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
  clearable = false,
  searchable = false,
  searchPlaceholder = "Търсене...",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption?.label || placeholder;
  const isPlaceholder = !selectedOption;

  const fuse = useMemo(
    () =>
      new Fuse(options, {
        keys: ["label", "value"],
        threshold: 0.3,
        includeScore: true,
      }),
    [options],
  );

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) {
      return options;
    }

    const results = fuse.search(searchTerm);
    return results.map((result) => result.item);
  }, [searchable, searchTerm, fuse, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);

      if (newIsOpen && searchable) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 0);
      }

      if (!newIsOpen) {
        setSearchTerm("");
      }
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange?.("");
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
      <div
        className={cn(
          triggerVariants({
            size,
            state: isOpen ? "open" : isPlaceholder ? "placeholder" : "default",
          }),
          disabled && "opacity-50 cursor-not-allowed",
          "cursor-pointer",
          isOpen && isPlaceholder && "text-gray-500",
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{displayText}</span>
        <div className="flex items-center gap-1">
          {clearable && selectedOption && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              tabIndex={-1}
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-200 text-gray-400",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className={dropdownMenuVariants({ size })} role="listbox">
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          <div className="max-h-48 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Няма намерени резултати
              </div>
            ) : (
              filteredOptions.map((option) => {
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
                      }),
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary-600" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

