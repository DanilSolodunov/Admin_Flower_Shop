import React, { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={clsx(
        "rounded-xl bg-slate-900 border border-slate-800 shadow-lg p-6",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }: CardSectionProps) => {
  return <div className={clsx("mb-4", className)}>{children}</div>;
};

export const CardTitle = ({ children, className = "" }: CardSectionProps) => {
  return (
    <h3 className={clsx("text-lg font-semibold text-white", className)}>
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className = "",
}: CardSectionProps) => {
  return (
    <p className={clsx("text-sm text-slate-400", className)}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = "" }: CardSectionProps) => {
  return <div className={className}>{children}</div>;
};
