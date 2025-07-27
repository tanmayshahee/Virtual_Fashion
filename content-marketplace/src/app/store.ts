import { configureStore } from "@reduxjs/toolkit";
import contentsReducer from "../features/contents/contentsSlice";
import filtersReducer from "../features/contents/filtersSlice";

export const store = configureStore({
  reducer: {
    contents: contentsReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
