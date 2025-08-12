"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from "@/components/ui";
import { LucideIcon } from "lucide-react";

interface LoginOptionCardProps {
  title: string;
  description: string;
  buttonText: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function LoginOptionCard({
  title,
  description,
  buttonText,
  icon: Icon,
  onClick,
}: LoginOptionCardProps) {
  return (
    <Card className="flex-1 hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
        <CardDescription className="text-gray-600 text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          variant="primary" 
          size="lg" 
          onClick={onClick}
          className="w-full"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}