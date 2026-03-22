import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AssignmentForm } from "./AssignmentForm";

describe("AssignmentForm", () => {
  it("shows validation feedback for a short question", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<AssignmentForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText(/paste the exact question/i), "Too short");
    await user.click(screen.getByRole("button", { name: /explain assignment/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getAllByText(/string must contain at least 20 character/i).length).toBeGreaterThan(0);
  });
});
