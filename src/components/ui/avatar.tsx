// src/components/ui/Avatar.tsx
import React, { ReactNode } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  children?: ReactNode;
}

export const Avatar = ({ src, alt = "Avatar", size = 32, className = "", children }: AvatarProps) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-200 ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? <img src={src} alt={alt} className="object-cover w-full h-full" /> : children}
    </div>
  );
};

export const AvatarFallback = ({ children, size = 32, className = "" }: { children: ReactNode; size?: number; className?: string }) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gray-400 text-white font-medium ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
};
