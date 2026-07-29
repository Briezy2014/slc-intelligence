import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/(public)/page";

describe("homepage", () => {
  it("renders product name and tagline without development prefacing", () => {
    render(<HomePage />);
    expect(screen.getAllByText("SLC Intelligence").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", {
        name: "The Intelligence Platform for Specialized Learning Classrooms",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/not approved for production use/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Development build/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/FERPA-compliant/i)).not.toBeInTheDocument();
  });
});
