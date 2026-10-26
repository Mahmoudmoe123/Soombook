// Pure helpers behind the search and filter bar on the home page.
// Kept out of the page component so they can be unit tested.

export const EMPTY_FILTERS = {
  search: "",
  category: "",
  origin: "",
  priceRange: "",
};

// Unique origin countries for the "All Origins" dropdown, sorted A-Z.
// Orders without an origin country are skipped so the dropdown has no blank option.
export function getOriginCountries(orders) {
  return [...new Set(orders.map((order) => order.originCountry).filter(Boolean))].sort();
}

// Keeps the orders that match every active filter.
// priceRange is "min-max" (inclusive) or "501+".
export function filterOrders(orders, filters) {
  return orders.filter((order) => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const titleMatch = order.title?.toLowerCase().includes(searchTerm);
      const descMatch = order.description?.toLowerCase().includes(searchTerm);
      if (!titleMatch && !descMatch) return false;
    }

    if (filters.category && order.category !== filters.category) {
      return false;
    }

    if (filters.origin && order.originCountry !== filters.origin) {
      return false;
    }

    if (filters.priceRange) {
      const price = Number(order.price);
      if (filters.priceRange === "501+") {
        if (price <= 500) return false;
      } else {
        const [min, max] = filters.priceRange.split("-").map(Number);
        if (price < min || price > max) return false;
      }
    }

    return true;
  });
}
