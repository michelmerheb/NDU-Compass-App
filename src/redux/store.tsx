import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import studyGroupReducer from "./slices/studyGroupSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    studyGroup: studyGroupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
