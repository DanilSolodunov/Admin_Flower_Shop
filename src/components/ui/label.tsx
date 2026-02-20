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
