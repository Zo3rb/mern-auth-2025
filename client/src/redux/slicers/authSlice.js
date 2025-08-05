import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;

      console.log("✅ Credentials set:", {
        user: user?.username,
        hasToken: !!token,
      });
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      console.log("🚪 Credentials cleared");
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    // Handle rehydration from localStorage
    rehydrateAuth: (state, action) => {
      const { user, token, refreshToken } = action.payload || {};
      if (user && token) {
        state.user = user;
        state.token = token;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        state.isLoading = false;

        console.log("🔄 Auth rehydrated from storage:", {
          user: user?.username,
        });
      }
    },
  },
  // Handle redux-persist rehydration
  extraReducers: (builder) => {
    builder.addCase("persist/REHYDRATE", (state, action) => {
      const persistedState = action.payload?.auth;
      if (persistedState?.user && persistedState?.token) {
        state.user = persistedState.user;
        state.token = persistedState.token;
        state.refreshToken = persistedState.refreshToken;
        state.isAuthenticated = true;
        state.isLoading = false;

        console.log("🔄 Redux Persist rehydrated auth:", {
          user: persistedState.user?.username,
          hasToken: !!persistedState.token,
        });
      }
    });
  },
});

export const { setCredentials, clearCredentials, setLoading, rehydrateAuth } =
  authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;
