import { EMPTY_FILTERS, filterOrders, getOriginCountries } from "../../src/lib/orderFilters";

const orders = [
  { id: "a", title: "iPhone 15 Pro", description: "Sealed box", category: "electronics", originCountry: "USA", price: 900 },
  { id: "b", title: "Running shoes", description: "Size 10, black", category: "sports", originCountry: "Egypt", price: 75 },
  { id: "c", title: "Face cream", description: "Two jars of the Korean brand", category: "beauty", originCountry: "South Korea", price: 40 },
  { id: "d", title: "Headphones", description: "Noise cancelling, like the iPhone ones", category: "electronics", originCountry: "Egypt", price: 150 },
  { id: "e", title: "Phone case", description: null, category: "electronics", originCountry: null, price: 50 },
];

const ids = (list) => list.map((order) => order.id);
const withFilters = (overrides) => ({ ...EMPTY_FILTERS, ...overrides });

describe("filterOrders", () => {
  test("returns every order when no filter is set", () => {
    expect(ids(filterOrders(orders, EMPTY_FILTERS))).toEqual(["a", "b", "c", "d", "e"]);
  });

  test("search matches the title or the description, ignoring case", () => {
    expect(ids(filterOrders(orders, withFilters({ search: "IPHONE" })))).toEqual(["a", "d"]);
  });

  test("search skips orders with no description without crashing", () => {
    expect(ids(filterOrders(orders, withFilters({ search: "case" })))).toEqual(["e"]);
  });

  test("filters by category", () => {
    expect(ids(filterOrders(orders, withFilters({ category: "electronics" })))).toEqual(["a", "d", "e"]);
  });

  test("filters by origin country", () => {
    expect(ids(filterOrders(orders, withFilters({ origin: "Egypt" })))).toEqual(["b", "d"]);
  });

  test("price ranges include both ends", () => {
    expect(ids(filterOrders(orders, withFilters({ priceRange: "0-50" })))).toEqual(["c", "e"]);
    expect(ids(filterOrders(orders, withFilters({ priceRange: "51-100" })))).toEqual(["b"]);
  });

  test("501+ keeps only orders above 500", () => {
    expect(ids(filterOrders(orders, withFilters({ priceRange: "501+" })))).toEqual(["a"]);
  });

  test("combines filters", () => {
    const filters = withFilters({ category: "electronics", origin: "Egypt", priceRange: "101-200" });
    expect(ids(filterOrders(orders, filters))).toEqual(["d"]);
  });

  test("returns an empty list when nothing matches", () => {
    expect(filterOrders(orders, withFilters({ search: "laptop" }))).toEqual([]);
  });
});

describe("getOriginCountries", () => {
  test("lists each country once, sorted, without blanks", () => {
    expect(getOriginCountries(orders)).toEqual(["Egypt", "South Korea", "USA"]);
  });

  test("handles an empty order list", () => {
    expect(getOriginCountries([])).toEqual([]);
  });
});
