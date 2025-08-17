import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [
    { id: 1, message: "3 pending orders" },
    { id: 2, message: "2 items low in stock" },
    { id: 3, message: "2 order is delivered" },
  ],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        message: action.payload,
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
