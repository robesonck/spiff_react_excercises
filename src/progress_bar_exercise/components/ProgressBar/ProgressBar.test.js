import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ProgressBar from "./ProgressBar";

describe("ProgressBar", () => {
  describe("No breakPoints", () => {
    it("Renders hidden when loading false", () => {
      render(<ProgressBar loading={false} />);
      const progressBar = screen.getByTestId("progress-bar");
      expect(progressBar.className).toBe("progress-bar hidden");
    });

    it("Animates when loading true", async () => {
      const expectedSeconds = 15;
      render(<ProgressBar loading expectedSeconds={expectedSeconds} />);

      const progressBar = screen.getByTestId("progress-bar");
      const progressBarInner = screen.getByTestId("progress-bar-inner");

      expect(progressBar.className).toBe("progress-bar visible");
      expect(progressBarInner.className).toBe("progress-bar__inner ");
      expect(progressBarInner.style.width).toBe("0%");

      await waitFor(() => expect(progressBarInner).toHaveClass("normal-step"));
      expect(progressBarInner.style.width).toBe("90%");
    });

    it("Animates when loading true and when back to false", async () => {
      const expectedSeconds = 15;
      const { rerender } = render(
        <ProgressBar loading expectedSeconds={expectedSeconds} />
      );

      const progressBarInner = screen.getByTestId("progress-bar-inner");

      await waitFor(() => expect(progressBarInner).toHaveClass("normal-step"));
      expect(progressBarInner.style.width).toBe("90%");

      rerender(
        <ProgressBar loading={false} expectedSeconds={expectedSeconds} />
      );
      expect(progressBarInner).toHaveClass("done");
      expect(progressBarInner.style.width).toBe("100%");
    });
  });

  describe("Breakpoints", () => {
    it("Works with breakpoints", async () => {
      render(
        <ProgressBar loading expectedSeconds={3} breakpoints={[20, 50]} />
      );

      const progressBar = screen.getByTestId("progress-bar");
      const progressBarInner = screen.getByTestId("progress-bar-inner");

      expect(progressBar.className).toBe("progress-bar visible");
      expect(progressBarInner.className).toBe("progress-bar__inner ");
      expect(progressBarInner.style.width).toBe("0%");

      await waitFor(() => expect(progressBarInner.style.width).toBe("20%"));
      await waitFor(() => expect(progressBarInner.style.width).toBe("50%"));
      await waitFor(() => expect(progressBarInner.style.width).toBe("90%"));
    });

    it("Works with breakpoints not sorted and higher than 100", async () => {
      render(
        <ProgressBar
          loading
          expectedSeconds={3}
          breakpoints={[80, 50, 20, 100]}
        />
      );

      const progressBar = screen.getByTestId("progress-bar");
      const progressBarInner = screen.getByTestId("progress-bar-inner");

      expect(progressBar.className).toBe("progress-bar visible");
      expect(progressBarInner.className).toBe("progress-bar__inner ");
      expect(progressBarInner.style.width).toBe("0%");

      await waitFor(() => expect(progressBarInner.style.width).toBe("20%"));
      await waitFor(() => expect(progressBarInner.style.width).toBe("50%"));
      await waitFor(() => expect(progressBarInner.style.width).toBe("80%"));
      expect(progressBarInner.style.width).not.toBe("100%");
    });
  });
});
