// import React, { useState, ReactNode } from "react";
// import clsx from "clsx";

// // Основной компонент Select
// export function Select({ value, onChange, children }: { value: string; onChange: (val: string) => void; children: ReactNode }) {
//   return <div className="relative">{children}</div>;
// }

// // Обертка для триггера выбора
// export function SelectTrigger({ children, className }: { children: ReactNode; className?: string }) {
//   return (
//     <button
//       className={clsx(
//         "w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-600 text-left hover:border-gray-400",
//         className
//       )}
//     >
//       {children}
//     </button>
//   );
// }

// // Отображение выбранного значения
// export function SelectValue({ children }: { children: ReactNode }) {
//   return <span>{children}</span>;
// }

// // Список опций
// export function SelectContent({ children, className }: { children: ReactNode; className?: string }) {
//   return (
//     <ul
//       className={clsx(
//         "absolute mt-1 w-full bg-gray-600 border border-gray-300 rounded-md shadow-lg z-10",
//         className
//       )}
//     >
//       {children}
//     </ul>
//   );
// }

// // Отдельная опция
// export function SelectItem({ value, children, onSelect }: { value: string; children: ReactNode; onSelect: (val: string) => void }) {
//   return (
//     <li
//       className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//       onClick={() => onSelect(value)}
//     >
//       {children}
//     </li>
//   );
// }


import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import clsx from "clsx";

interface SelectContextType {
  value: string;
  onValueChange: (val: string) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

export function Select({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (val: string) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // закрытие при клике вне
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used inside Select");

  const { open, setOpen } = context;

  return (
    <button
      id={id}
      type="button"
      onClick={() => setOpen(!open)}
      className={clsx(
        "flex items-center justify-between gap-2",
        "px-4 py-2 w-48",
        "bg-gray-800 text-white",
        "border border-gray-600",
        "rounded-lg",
        "hover:border-gray-400",
        "transition-colors",
        className
      )}
    >
      {children}

      <svg
        className={clsx(
          "w-4 h-4 transition-transform",
          open && "rotate-180"
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function SelectValue({
  placeholder,
}: {
  placeholder?: string;
}) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used inside Select");

  const { value } = context;

  return (
    <span className="text-sm">
      {value === "all" || !value ? placeholder : value}
    </span>
  );
}

export function SelectContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used inside Select");

  const { open } = context;

  if (!open) return null;

  return (
    <div
      className={clsx(
        "absolute right-0 mt-2 w-48",
        "bg-gray-800",
        "border border-gray-600",
        "rounded-lg shadow-xl",
        "z-50 overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used inside Select");

  const { onValueChange, setOpen } = context;

  return (
    <div
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      className="px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer transition-colors"
    >
      {children}
    </div>
  );
}
