import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "./slices/resumeSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
