import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { SearchBox } from "@/components/SearchBox";

afterEach(() => cleanup());

describe("SearchBox", () => {
  it("displays the controlled value", () => {
    const { getByRole } = render(<SearchBox value="холод" onChange={() => undefined} />);
    expect((getByRole("searchbox") as HTMLInputElement).value).toBe("холод");
  });

  it("calls onChange with the new typed value", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<SearchBox value="" onChange={onChange} />);
    fireEvent.change(getByRole("searchbox"), { target: { value: "квест" } });
    expect(onChange).toHaveBeenCalledWith("квест");
  });

  it("uses a custom placeholder when provided", () => {
    const { getByPlaceholderText } = render(
      <SearchBox value="" onChange={() => undefined} placeholder="свой плейсхолдер" />,
    );
    expect(getByPlaceholderText("свой плейсхолдер")).toBeInTheDocument();
  });
});
