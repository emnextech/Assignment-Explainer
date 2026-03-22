import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders the status label", () => {
    const { container } = render(<StatusBadge status="failed" />);

    expect(container).toHaveTextContent("failed");
  });
});
