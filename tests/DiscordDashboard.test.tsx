import { render, screen } from "@testing-library/react";
import DiscordDashboard from "../app/components/DiscordDashboard";

describe("DiscordDashboard", () => {
  it("renders the four dashboard metrics with expected labels and values", () => {
    render(<DiscordDashboard />);

    // Check headings and values
    expect(screen.getByText(/Discord Dashboard/i)).toBeInTheDocument();

    expect(screen.getByText(/Total Members/i)).toBeInTheDocument();
    expect(screen.getByText(/12,849/)).toBeInTheDocument();

    expect(screen.getByText(/Online Users/i)).toBeInTheDocument();
    expect(screen.getByText(/2,103/)).toBeInTheDocument();

    expect(screen.getByText(/New Members \(7d\)/i)).toBeInTheDocument();
    expect(screen.getByText(/412/)).toBeInTheDocument();

    expect(screen.getByText(/Total Bots/i)).toBeInTheDocument();
    // Ensure we find the exact '8' value (avoid matching digits inside larger numbers)
    expect(screen.getByText((content) => content.trim() === "8")).toBeInTheDocument();
  });
});
