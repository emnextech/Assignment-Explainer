import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    authBootstrapError: null,
    user: { email: "student@example.com" },
    signOut: vi.fn()
  })
}));

vi.mock("../hooks/useAssignments", () => ({
  useHistoryItem: () => ({
    isLoading: false,
    data: {
      explanationId: "id",
      assignmentId: "assignment",
      status: "failed",
      model: "gpt-5-mini",
      title: "Economics Assignment 1",
      courseName: "Economics",
      questionText: "Discuss the significance and concept of equilibrium in economic theory.",
      wordCount: 1200,
      level: "Year 1",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      refusalReason: null,
      errorMessage: "The model response could not be parsed.",
      result: null
    }
  })
}));

vi.mock("../hooks/useProfile", () => ({
  useProfileIdentity: () => ({
    displayName: "Student",
    initials: "ST",
    university: "Cavendish University"
  })
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "id" }),
    useNavigate: () => vi.fn(),
    NavLink: ({ children }: { children: ReactNode }) => <>{children}</>,
    Link: ({ children }: { children: ReactNode }) => <>{children}</>
  };
});

import { ResultPage } from "./ResultPage";

describe("ResultPage", () => {
  it("shows a fallback state for failed explanations", () => {
    render(<ResultPage />);

    expect(screen.getByText(/did not complete/i)).toBeInTheDocument();
    expect(screen.getByText(/could not be parsed/i)).toBeInTheDocument();
  });
});
