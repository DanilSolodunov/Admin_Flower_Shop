// // src/components/ui/Card.tsx
// import React, { ReactNode } from "react";

// // ============================
// // Типы
// // ============================
// interface CardProps {
//   children: ReactNode;
//   className?: string;
// }

// interface CardSectionProps {
//   children: ReactNode;
//   className?: string;
// }

// // ============================
// // Основной Card
// // ============================
// export const Card = ({ children, className = "" }: CardProps) => {
//   return (
//     <div className={`rounded-lg shadow p-4 ${className}`}>
//       {children}
//     </div>
//   );
// };

// // ============================
// // Card Header
// // ============================
// export const CardHeader = ({ children, className = "" }: CardSectionProps) => {
//   return <div className={`mb-2 ${className}`}>{children}</div>;
// };

// // ============================
// // Card Title
// // ============================
// export const CardTitle = ({ children, className = "" }: CardSectionProps) => {
//   return <h3 className={`text-lg font-bold ${className}`}>{children}</h3>;
// };

// // ============================
// // Card Description
// // ============================
// export const CardDescription = ({ children, className = "" }: CardSectionProps) => {
//   return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
// };

// // ============================
// // Card Content
// // ============================
// export const CardContent = ({ children, className = "" }: CardSectionProps) => {
//   return <div className={className}>{children}</div>;
// };



// src/components/ui/Card.tsx
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
