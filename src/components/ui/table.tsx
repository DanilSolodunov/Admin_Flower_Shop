import React from "react";
import clsx from "clsx";

type TableTheme = "dark" | "light";

interface TableProps {
  children: React.ReactNode;
  className?: string;
  theme?: TableTheme;
}

export const Table = ({
  children,
  className,
  theme = "dark",
}: TableProps) => {
  const isDark = theme === "dark";

  return (
    <div
      className={clsx(
        "w-full overflow-hidden rounded-2xl border",
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-slate-200"
      )}
    >
      <table
        className={clsx(
          "min-w-full border-collapse text-sm",
          isDark ? "text-slate-200" : "text-slate-700",
          className
        )}
      >
        {children}
      </table>
    </div>
  );
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  theme?: TableTheme;
}

export const TableHeader = ({
  children,
  className,
  theme = "dark",
}: SectionProps) => {
  const isDark = theme === "dark";

  return (
    <thead
      className={clsx(
        "border-b",
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-slate-50 border-slate-200",
        className
      )}
    >
      {children}
    </thead>
  );
};

export const TableBody = ({ children }: { children: React.ReactNode }) => {
  return <tbody>{children}</tbody>;
};

export const TableRow = ({
  children,
  className,
  theme = "dark",
}: SectionProps) => {
  const isDark = theme === "dark";

  return (
    <tr
      className={clsx(
        "border-b transition-colors",
        isDark
          ? "border-slate-700 hover:bg-slate-700/40"
          : "border-slate-200 hover:bg-slate-50",
        className
      )}
    >
      {children}
    </tr>
  );
};

export const TableCell = ({
  children,
  className,
  theme = "dark",
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & {
  theme?: TableTheme;
}) => {
  const isDark = theme === "dark";

  return (
    <td
      className={clsx(
        "px-6 py-4",
        isDark ? "text-slate-200" : "text-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
};

export const TableHead = ({
  children,
  className,
  theme = "dark",
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & {
  theme?: TableTheme;
}) => {
  const isDark = theme === "dark";

  return (
    <th
      className={clsx(
        "px-6 py-4 text-left font-semibold tracking-wide",
        isDark ? "text-slate-300" : "text-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};
