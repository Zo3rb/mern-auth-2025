import { createSlice } from "@reduxjs/toolkit";

// Helper functions for localStorage
const loadUserFromStorage = () => {
  try {
    const serializedUser = localStorage.getItem("userInfo");
    return serializedUser ? JSON.parse(serializedUser) : null;
  } catch (error) {
    console.error("Error loading user from localStorage:", error);
    return null;
  }
};

const saveUserToStorage = (user) => {
  try {
    const serializedUser = JSON.stringify(user);
    localStorage.setItem("userInfo", serializedUser);
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
  }
};

const removeUserFromStorage = () => {
  try {
    localStorage.removeItem("userInfo");
  } catch (error) {
    console.error("Error removing user from localStorage:", error);
  }
};

// Initial state
const initialState = {
  userInfo: loadUserFromStorage(), // Load from localStorage on app start
  isAuthenticated: !!loadUserFromStorage(), // True if user exists in localStorage
  isInitialized: false, // Track if auth has been initialized
  token: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user credentials (when login/register is successful)
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;

      state.userInfo = user;
      state.isAuthenticated = true;
      state.isInitialized = true;

      // Save tokens if provided
      if (token) {
        state.token = token;
        localStorage.setItem("token", token);
      }

      if (refreshToken) {
        state.refreshToken = refreshToken;
        localStorage.setItem("refreshToken", refreshToken);
      }

      // Save user to localStorage
      saveUserToStorage(user);
    },

    // Clear user credentials (when logout or auth fails)
    clearCredentials: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;

      // Clear localStorage
      removeUserFromStorage();
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },

    // Set initialization flag
    setInitialized: (state) => {
      state.isInitialized = true;
    },

    // Update tokens
    updateTokens: (state, action) => {
      const { token, refreshToken } = action.payload;

      if (token) {
        state.token = token;
        localStorage.setItem("token", token);
      }

      if (refreshToken) {
        state.refreshToken = refreshToken;
        localStorage.setItem("refreshToken", refreshToken);
      }
    },

    // Reset entire auth state
    resetAuth: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.isInitialized = false;
      state.token = null;
      state.refreshToken = null;

      // Clear localStorage
      removeUserFromStorage();
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },
});

// Export actions for use in components
export const {
  setCredentials,
  clearCredentials,
  setInitialized,
  updateTokens,
  resetAuth,
} = authSlice.actions;

// Selectors for easy state access
export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsInitialized = (state) => state.auth.isInitialized;
export const selectToken = (state) => state.auth.token;
export const selectRefreshToken = (state) => state.auth.refreshToken;

// Export the reducer
export default authSlice.reducer;
