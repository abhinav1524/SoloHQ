import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Add new notification
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload); // latest on top
    },
    // Set all notifications (used when fetching from backend)
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
    },
    // Remove single notification
     removeNotification: (state, action) => {
      // action.payload = notification id
      state.notifications = state.notifications.filter(
        (n) => n._id !== action.payload
      );
    },
  },
});

export const {
  addNotification,
  clearNotifications,
  removeNotification,
  setNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
