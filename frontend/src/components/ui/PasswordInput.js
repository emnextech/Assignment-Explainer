import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from "clsx";
import { useState } from "react";
import { Input } from "./Input";
export const PasswordInput = ({ className, ...props }) => {
    const [visible, setVisible] = useState(false);
    return (_jsxs("div", { className: "relative", children: [_jsx(Input, { ...props, className: clsx("pr-20", className), type: visible ? "text" : "password" }), _jsx("button", { className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-semibold text-ink/65 transition hover:bg-sand hover:text-ink", onClick: () => setVisible((current) => !current), type: "button", children: visible ? "Hide" : "Show" })] }));
};
