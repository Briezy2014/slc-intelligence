import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { SkipLink } from "@/components/accessibility/skip-link";

describe("accessible UI primitives", () => {
  it("renders a labeled button", () => {
    render(<Button>Save draft</Button>);
    expect(screen.getByRole("button", { name: "Save draft" })).toBeInTheDocument();
  });

  it("exposes empty state status content", () => {
    render(
      <EmptyState
        title="No assigned students yet"
        description="Student records will appear here after Phase 5 authorization."
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("No assigned students yet");
  });

  it("provides a skip link", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main-content",
    );
  });
});
