// // src/components/ui/RadioGroup.tsx
// import React, { createContext, useContext, ReactNode } from "react";

// // ============================
// // Типы
// // ============================
// interface RadioGroupContextType {
//   value: string;
//   onChange: (value: string) => void;
// }

// const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

// interface RadioGroupProps {
//   value: string;
//   onChange: (value: string) => void;
//   children: ReactNode;
// }

// interface RadioGroupItemProps {
//   value: string;
//   children: ReactNode;
// }

// // ============================
// // RadioGroup
// // ============================
// export const RadioGroup = ({ value, onChange, children }: RadioGroupProps) => {
//   return (
//     <RadioGroupContext.Provider value={{ value, onChange }}>
//       <div role="radiogroup" className="flex flex-col gap-2">
//         {children}
//       </div>
//     </RadioGroupContext.Provider>
//   );
// };

// // ============================
// // RadioGroupItem
// // ============================
// export const RadioGroupItem = ({ value, children }: RadioGroupItemProps) => {
//   const context = useContext(RadioGroupContext);
//   if (!context) {
//     throw new Error("RadioGroupItem must be used within a RadioGroup");
//   }

//   const checked = context.value === value;

//   return (
//     <label className={`flex items-center gap-2 cursor-pointer ${checked ? "font-semibold" : ""}`}>
//       <input
//         type="radio"
//         value={value}
//         checked={checked}
//         onChange={() => context.onChange(value)}
//         className="accent-blue-500"
//       />
//       {children}
//     </label>
//   );
// };


// src/components/ui/RadioGroup.tsx
import React, { createContext, useContext, ReactNode } from "react";
import clsx from "clsx";

interface RadioGroupContextType {
  value: string;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(
  undefined
);

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface RadioGroupItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const RadioGroup = ({
  value,
  onChange,
  children,
  className,
}: RadioGroupProps) => {
  return (
    <RadioGroupContext.Provider value={{ value, onChange }}>
      <div role="radiogroup" className={clsx("flex flex-col gap-2", className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

export const RadioGroupItem = ({
  value,
  children,
  className,
}: RadioGroupItemProps) => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup");
  }

  const checked = context.value === value;

  return (
    <div
      onClick={() => context.onChange(value)}
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border transition-all duration-200",
        checked
          ? "bg-slate-900 border-blue-500 ring-1 ring-blue-500/40 text-white"
          : "bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-500 text-slate-300",
        className
      )}
    >
      <div
        className={clsx(
          "w-4 h-4 rounded-full border flex items-center justify-center",
          checked ? "border-blue-500" : "border-slate-500"
        )}
      >
        {checked && <div className="w-2 h-2 rounded-full bg-blue-500" />}
      </div>

      <span className="font-medium">{children}</span>
    </div>
  );
};
