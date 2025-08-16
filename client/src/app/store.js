// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../features/NotificationSlice";
import OrderSlice from "../features/OrderSlice";
export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    orders:OrderSlice
  },
});
