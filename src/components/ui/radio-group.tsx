import React, { createContext, useContext, ReactNode } from "react";
import clsx from "clsx";

interface RadioGroupContextType {
  value: string;
  onValueChange: (value: string) => void;
  name: string;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(
  undefined
);

export interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
  name?: string;
}

export interface RadioGroupItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function RadioGroup({
  value,
  onValueChange,
  children,
  className,
  name = "radio-group",
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, name }}>
      <div className={clsx("flex flex-col gap-3", className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({
  value,
  children,
  className,
}: RadioGroupItemProps) {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupItem must be used within RadioGroup");
  }

  const checked = context.value === value;

  return (
    <label
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border transition-all duration-200 select-none",
        checked
          ? "bg-slate-200 border-blue-500 ring-1 ring-blue-500/40 text-ыдфеу-900"
          : "bg-slate-200 border-slate-700 hover:bg-slate-700 hover:border-slate-500 text-slate-900",
        className
      )}
    >
      {/* Настоящий radio input (скрытый) */}
      <input
        type="radio"
        name={context.name}
        value={value}
        checked={checked}
        onChange={() => context.onValueChange(value)}
        className="hidden"
      />

      {/* Кастомный кружок */}
      <div
        className={clsx(
          "w-4 h-4 rounded-full border flex items-center justify-center",
          checked ? "border-blue-500" : "border-slate-500"
        )}
      >
        {checked && <div className="w-2 h-2 rounded-full bg-blue-500" />}
      </div>

      <span className="font-medium">{children}</span>
    </label>
  );
}