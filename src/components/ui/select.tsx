import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import clsx from "clsx";

interface SelectContextType<T extends string | number> {
  value: T;
  onValueChange: (val: T) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
}

const SelectContext = createContext<SelectContextType<any> | null>(null);

export interface SelectProps<T extends string | number> {
  value: T;
  onValueChange: (val: T) => void;
  children: ReactNode;
}

export function Select<T extends string | number>({
  value,
  onValueChange,
  children,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider
      value={{ value, onValueChange, open, setOpen }}
    >
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SelectTrigger({
  children,
  className,
  id,
}: SelectTriggerProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used inside Select");

  const { open, setOpen } = context;

  return (
    <button
      id={id}
      type="button"
      onClick={() => setOpen(!open)}
      className={clsx(
        "flex items-center justify-between gap-2 px-4 py-2 w-48 bg-gray-100 text-slate-900 border border-gray-100 rounded-lg hover:border-gray-100 transition-colors",
        className
      )}
    >
      {children}
      <svg
        className={clsx("w-4 h-4 transition-transform", open && "rotate-180")}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used inside Select");

  const { value } = context;

  return (
    <span className="text-sm">
      {value === undefined || value === null || value === ""
        ? placeholder
        : String(value)}
    </span>
  );
}

interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

export function SelectContent({
  children,
  className,
}: SelectContentProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used inside Select");

  const { open } = context;

  if (!open) return null;

  return (
    <div
      className={clsx(
        "absolute right-0 mt-2 w-48 bg-gray-100 border border-gray-100 text-slate-900 rounded-lg shadow-xl z-50 overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SelectItemProps<T extends string | number> {
  value: T;
  children: ReactNode;
}

export function SelectItem<T extends string | number>({
  value,
  children,
}: SelectItemProps<T>) {
  const context = useContext(
    SelectContext
  ) as SelectContextType<T> | null;

  if (!context)
    throw new Error("SelectItem must be used inside Select");

  const { onValueChange, setOpen } = context;

  return (
    <div
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      className="px-4 py-2 text-sm text-slate-900 hover:bg-gray-100 cursor-pointer transition-colors"
    >
      {children}
    </div>
  );
}