import React from "react";
import { render, screen } from "@testing-library/react";
import Button from "./Button";
import userEvent from "@testing-library/user-event";

describe("Button", () => {
  it("Renders content with default variant", () => {
    render(<Button>My Button</Button>);

    const button = screen.getByRole("button", { name: "My Button" });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn");
    expect(button).toHaveClass("primary");
  });

  it("Renders danger variant", () => {
    render(<Button variant="danger">My Button</Button>);

    expect(screen.getByRole("button", { name: "My Button" })).toHaveClass(
      "danger"
    );
  });

  it("Handles click correctly", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>My Button</Button>);

    const button = screen.getByRole("button", { name: "My Button" });
    userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
