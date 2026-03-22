import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./StatusBadge";
describe("StatusBadge", () => {
    it("renders the status label", () => {
        render(_jsx(StatusBadge, { status: "failed" }));
        expect(screen.getByText("failed")).toBeInTheDocument();
    });
});
