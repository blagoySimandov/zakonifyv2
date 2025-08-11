"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: 
          "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
        secondary: 
          "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-gray-400",
        success: 
          "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg",
        danger: 
          "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg",
        ghost: 
          "text-gray-600 hover:bg-gray-100",
      },
      size: {
        sm: "px-4 py-2 text-sm rounded-lg",
        md: "px-6 py-3 text-base rounded-xl",
        lg: "px-8 py-4 text-lg rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  children,
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Зарежда се..." : children}
    </button>
  );
}