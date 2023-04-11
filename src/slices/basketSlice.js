import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    //actions
    addToBasket: (state, action) => {
      // Check if the item already exists in the basket
      const index = state.items.findIndex(
        (basketItem) => basketItem.id === action.payload.id
      );

      if (index === -1) {
        // The item doesn't exist, add it to the basket
        state.items = [...state.items, action.payload];
      } else {
        console.warn(
          `Can't add product (id: ${action.payload.id}) as it's already in the basket`
        );
      }
    },
    removeFromBasket: (state, action) => {
      const index = state.items.findIndex(
        (basketItem) => basketItem.id === action.payload.id
      );
      let newBasket = [...state.items];
      if (index >= 0) {
        //the items exitss,remove it
        newBasket.splice(index, 1);
      } else {
        console.warn(
          `Cant remove product (id: ${action.payload.id}) as its not in the basket`
        );
      }
      state.items = newBasket;
    },
    clearBasket: (state) => {
      state.items = [];
    },
  },
});

export const { addToBasket, removeFromBasket,clearBasket } = basketSlice.actions;
// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket.items;
export const selectTotal =(state)=> state.basket.items.reduce((total, item) => total+item.price ,0)


export default basketSlice.reducer;
