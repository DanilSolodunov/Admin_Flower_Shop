// import React from "react";
// import clsx from "clsx";

// // ============================
// // Основная таблица
// // ============================
// export const Label = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <table className="min-w-full border-collapse border border-gray-900 bg-gray-700 text-white">
//       {children}
//     </table>
//   );
// };


// // ============================
// // Заголовок таблицы
// // ============================
// export const LabelHeader = ({ children }: { children: React.ReactNode }) => {
//   return <thead className="bg-gray-800">{children}</thead>;
// };

// // Псевдоним для совместимости с импортом TableHead
// export const LabelHead = LabelHeader;

// // ============================
// // Тело таблицы
// // ============================
// export const LabelBody = ({ children }: { children: React.ReactNode }) => {
//   return <tbody>{children}</tbody>;
// };

// // ============================
// // Строка таблицы
// // ============================
// export const LabelRow = ({
//   children,
//   className,
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => {
//   return (
//     <tr className={clsx("border-b border-gray-200 hover:bg-gray-200", className)}>
//       {children}
//     </tr>
//   );
// };

// // ============================
// // Ячейка таблицы
// // ============================
// export const LabelCell = ({
//   children,
//   className,
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => {
//   return <td className={clsx("px-4 py-2 text-left text-gray-900", className)}>{children}</td>;
// };

// // ============================
// // Заголовочная ячейка
// // ============================
// export const LabelHeadCell = ({
//   children,
//   className,
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => {
//   return (
//     <th className={clsx("px-4 py-2 text-left font-semibold text-white", className)}>
//       {children}
//     </th>
//   );
// };



// src/components/ui/label.tsx
import React from "react";
import clsx from "clsx";

interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export const Label = ({ className, ...props }: LabelProps) => {
  return (
    <label
      className={clsx(
        "text-sm font-medium text-slate-700",
        className
      )}
      {...props}
    />
  );
};
