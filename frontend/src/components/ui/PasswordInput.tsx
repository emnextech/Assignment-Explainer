import clsx from "clsx";
import { useState, type InputHTMLAttributes } from "react";

import { Input } from "./Input";

export const PasswordInput = ({
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} className={clsx("pr-20", className)} type={visible ? "text" : "password"} />
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-semibold text-ink/65 transition hover:bg-sand hover:text-ink"
        onClick={() => setVisible((current) => !current)}
        type="button"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
};
