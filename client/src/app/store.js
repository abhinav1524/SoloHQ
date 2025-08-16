// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../features/NotificationSlice";
export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
  },
});
