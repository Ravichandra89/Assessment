import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "../features/event/eventSlice";
import profileReducer from "../features/profiles/profileSlice";

export const store = configureStore({
  reducer: {
    profiles: profileReducer,
    events: eventReducer,
  },
  devTools: import.meta.env.MODE !== "production", // Enable Redux DevTools in dev
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
