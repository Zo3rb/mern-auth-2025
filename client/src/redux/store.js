import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./slicers/apiSlice";
import authReducer from "./slicers/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer, // Add the API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(authApi.middleware), // Add RTK Query middleware
  devTools: import.meta.env.MODE !== "production",
});

export default store;
