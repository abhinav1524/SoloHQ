import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  list: [],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    updateOrders: (state, action) => {   // ✅ renamed
      state.list = action.payload;
    },
  },
});

export const { updateOrders } = orderSlice.actions;  // ✅ renamed
export default orderSlice.reducer;
