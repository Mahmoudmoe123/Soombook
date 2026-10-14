import reducer, {
  addToBasket,
  removeFromBasket,
  clearBasket,
  selectItems,
  selectTotal,
} from "../../src/slices/basketSlice";

const item = (id, price) => ({ id, title: `Item ${id}`, price });

describe("basket slice", () => {
  let warn;

  beforeEach(() => {
    warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  test("starts empty", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual({ items: [] });
  });

  test("adds an item", () => {
    const state = reducer(undefined, addToBasket(item(1, 20)));
    expect(state.items).toEqual([item(1, 20)]);
  });

  test("does not add the same item twice", () => {
    let state = reducer(undefined, addToBasket(item(1, 20)));
    state = reducer(state, addToBasket(item(1, 20)));
    expect(state.items).toHaveLength(1);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  test("removes an item by id", () => {
    let state = reducer(undefined, addToBasket(item(1, 20)));
    state = reducer(state, addToBasket(item(2, 35)));
    state = reducer(state, removeFromBasket({ id: 1 }));
    expect(state.items).toEqual([item(2, 35)]);
  });

  test("leaves the basket alone when removing an item that is not in it", () => {
    const before = reducer(undefined, addToBasket(item(1, 20)));
    const after = reducer(before, removeFromBasket({ id: 99 }));
    expect(after.items).toEqual([item(1, 20)]);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  test("clears the basket", () => {
    let state = reducer(undefined, addToBasket(item(1, 20)));
    state = reducer(state, clearBasket());
    expect(state.items).toEqual([]);
  });

  test("selectors return the items and their total price", () => {
    const rootState = { basket: { items: [item(1, 20), item(2, 35)] } };
    expect(selectItems(rootState)).toHaveLength(2);
    expect(selectTotal(rootState)).toBe(55);
  });

  test("total is 0 for an empty basket", () => {
    expect(selectTotal({ basket: { items: [] } })).toBe(0);
  });
});
