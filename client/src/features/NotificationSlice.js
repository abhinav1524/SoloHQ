import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: []
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) notification.read = true;
    },
    clearNotification: (state) => {
      state.notifications = [];
    }
  }
});

export const { addNotification, markAsRead, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
