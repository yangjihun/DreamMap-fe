import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "./slices/resumeSlice";
import authReducer from "./slices/authSlice";
import roadmapReducer from "./slices/roadmapSlice";

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    auth: authReducer,
    roadmap: roadmapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
