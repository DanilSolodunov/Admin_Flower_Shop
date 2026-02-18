// src/components/ui/table.tsx
import React from "react";
import clsx from "clsx";

// ============================
// Основная таблица
// ============================
interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table = ({ children, className }: TableProps) => {
  return (
    <table
      className={clsx(
        "min-w-full border-collapse border border-slate-200 bg-white text-slate-900",
        className
      )}
    >
      {children}
    </table>
  );
};

// ============================
// Заголовок таблицы
// ============================
export const TableHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <thead className={clsx("bg-slate-50", className)}>{children}</thead>;
};

// ============================
// Тело таблицы
// ============================
export const TableBody = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <tbody>{children}</tbody>;
};

// ============================
// Строка таблицы
// ============================
export const TableRow = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <tr
      className={clsx(
        "border-b border-slate-200 hover:bg-slate-50 transition-colors",
        className
      )}
    >
      {children}
    </tr>
  );
};

// ============================
// Ячейка таблицы
// ============================
export const TableCell = ({
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td
      className={clsx("px-4 py-3 text-sm text-slate-700", className)}
      {...props}
    >
      {children}
    </td>
  );
};

// ============================
// Заголовочная ячейка
// ============================
export const TableHead = ({
  children,
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th
      className={clsx(
        "px-4 py-3 text-left text-sm font-semibold text-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};
