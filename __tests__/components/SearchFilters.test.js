import { fireEvent, render, screen } from "@testing-library/react";
import SearchFilters from "../../src/components/SearchFilters";

const renderFilters = (props = {}) => {
  const onFilterChange = jest.fn();
  render(<SearchFilters onFilterChange={onFilterChange} originCountries={["Egypt", "USA"]} {...props} />);
  return onFilterChange;
};

describe("SearchFilters", () => {
  test("reports what the user types in the search box", () => {
    const onFilterChange = renderFilters();
    // The component renders one search box for phones and one for desktops.
    const searchBoxes = screen.getAllByPlaceholderText("Search orders...");
    expect(searchBoxes).toHaveLength(2);

    fireEvent.change(searchBoxes[0], { target: { value: "iphone" } });
    expect(onFilterChange).toHaveBeenCalledWith("search", "iphone");
  });

  test("lists the origin countries it is given", () => {
    renderFilters();
    expect(screen.getByRole("option", { name: "Egypt" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "USA" })).toBeInTheDocument();
  });

  test("reports category, origin and price choices", () => {
    const onFilterChange = renderFilters();

    fireEvent.change(screen.getByDisplayValue("All Categories"), { target: { value: "electronics" } });
    fireEvent.change(screen.getByDisplayValue("All Origins"), { target: { value: "Egypt" } });
    fireEvent.change(screen.getByDisplayValue("Any Price"), { target: { value: "501+" } });

    expect(onFilterChange).toHaveBeenCalledWith("category", "electronics");
    expect(onFilterChange).toHaveBeenCalledWith("origin", "Egypt");
    expect(onFilterChange).toHaveBeenCalledWith("priceRange", "501+");
  });
});
