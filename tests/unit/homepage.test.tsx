import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/(public)/page";

describe("homepage", () => {
  it("renders product name, tagline, and development notice", () => {
    render(<HomePage />);
    expect(screen.getAllByText("SLC Intelligence").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", {
        name: "The Intelligence Platform for Specialized Learning Classrooms",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/not approved for production use/i)).toBeInTheDocument();
    expect(screen.queryByText(/FERPA-compliant/i)).not.toBeInTheDocument();
  });
});
