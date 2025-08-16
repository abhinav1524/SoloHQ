const initialState = {
  list: [],
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setInventory: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setInventory } = inventorySlice.actions;
export default inventorySlice.reducer;
