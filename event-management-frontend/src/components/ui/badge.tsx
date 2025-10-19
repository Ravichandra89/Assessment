// src/components/ui/Badge.tsx
import * as React from "react";
import { cn } from "../../lib/utils";
import { badgeVariants } from "./bedgeVariants";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  ...props
}) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
};

Badge.displayName = "Badge";
