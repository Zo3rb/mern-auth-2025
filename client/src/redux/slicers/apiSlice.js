import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

// Dynamic API URL configuration
const getBaseUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    console.log("🔗 Using VITE_API_URL:", import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }

  // Fallback to current domain + /api/v1 for production
  if (import.meta.env.PROD) {
    const prodUrl = `${window.location.origin}/api/v1`;
    console.log("🔗 Using production URL:", prodUrl);
    return prodUrl;
  }

  // Development fallback
  const devUrl = "http://localhost:5000/api/v1";
  console.log("🔗 Using development URL:", devUrl);
  return devUrl;
};

// Custom axios base query function
const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers }, { getState }) => {
    try {
      // Get token from persisted state
      const token = getState()?.auth?.token;

      // Add token to headers if available
      const requestHeaders = {
        "Content-Type": "application/json",
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      console.log("🚀 API Request Details:");
      console.log("- URL:", baseUrl + url);
      console.log("- Method:", method);
      console.log("- Data:", data);
      console.log("- Headers:", requestHeaders);
      console.log("- Has Token:", !!token);

      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: requestHeaders,
        withCredentials: true,
        timeout: 10000, // 10 second timeout
      });

      console.log("✅ API Response Success:", result.data);
      return { data: result.data };
    } catch (axiosError) {
      console.error("❌ API Error:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
        url: baseUrl + url,
        code: axiosError.code,
      });

      // Handle different error types
      let errorResponse = {
        status: axiosError.response?.status || 500,
        data: axiosError.response?.data || {
          success: false,
          error: axiosError.message || "Network Error",
        },
      };

      // Handle timeout errors
      if (axiosError.code === "ECONNABORTED") {
        errorResponse = {
          status: 408,
          data: { success: false, error: "Request timeout" },
        };
      }

      // Handle network errors
      if (axiosError.code === "ERR_NETWORK") {
        errorResponse = {
          status: 503,
          data: {
            success: false,
            error: "Network error - server might be down",
          },
        };
      }

      return { error: errorResponse };
    }
  };

// Create the API
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({
    baseUrl: getBaseUrl(),
  }),
  tagTypes: ["User", "Auth"],
  keepUnusedDataFor: 60, // Keep cache for 60 seconds
  refetchOnMountOrArgChange: true,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    // Health check endpoint
    healthCheck: builder.query({
      query: () => ({
        url: "/health",
        method: "GET",
      }),
      transformResponse: (response) => {
        console.log("✅ Health check response:", response);
        return response;
      },
    }),

    // Register user - Include confirmPassword
    registerUser: builder.mutation({
      query: (userData) => {
        // Only remove avatar, keep confirmPassword for backend validation
        const { avatar, ...cleanData } = userData;

        console.log("📤 Registration data being sent:", {
          ...cleanData,
          password: "[REDACTED]",
          confirmPassword: "[REDACTED]",
        });
        console.log(
          "📤 Contains confirmPassword:",
          "confirmPassword" in cleanData
        );

        return {
          url: "/auth/register",
          method: "POST",
          data: cleanData, // Includes: username, email, password, confirmPassword
        };
      },
      invalidatesTags: ["User", "Auth"],
      transformResponse: (response) => {
        console.log("✅ Registration successful:", {
          ...response,
          token: response.token ? "[TOKEN_RECEIVED]" : "NO_TOKEN",
        });
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("❌ Registration error:", response);
        return response;
      },
    }),

    // Login user
    loginUser: builder.mutation({
      query: (credentials) => {
        console.log("📤 Login credentials being sent:", {
          email: credentials.email,
          hasPassword: !!credentials.password,
          rememberMe: credentials.rememberMe || false,
        });

        return {
          url: "/auth/login",
          method: "POST",
          data: credentials,
        };
      },
      invalidatesTags: ["User", "Auth"],
      transformResponse: (response) => {
        console.log("✅ Login successful:", {
          ...response,
          token: response.token ? "[TOKEN_RECEIVED]" : "NO_TOKEN",
        });
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("❌ Login error:", response);
        return response;
      },
    }),

    // Logout user
    logoutUser: builder.mutation({
      query: () => {
        console.log("📤 Logout request being sent");

        return {
          url: "/auth/logout",
          method: "POST",
        };
      },
      invalidatesTags: ["User", "Auth"],
      transformResponse: (response) => {
        console.log("✅ Logout successful:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("❌ Logout error:", response);
        return response;
      },
    }),

    // Get current user profile
    getCurrentUser: builder.query({
      query: () => {
        console.log("📤 Get current user request being sent");

        return {
          url: "/auth/profile",
          method: "GET",
        };
      },
      providesTags: ["User"],
      transformResponse: (response) => {
        console.log("✅ Current user data received:", {
          ...response,
          user: response.user
            ? {
                id: response.user.id,
                email: response.user.email,
                username: response.user.username,
              }
            : "NO_USER",
        });
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("❌ Get current user error:", response);
        return response;
      },
    }),

    // Update user profile
    updateUserProfile: builder.mutation({
      query: (userData) => {
        console.log("📤 Update profile data being sent:", {
          ...userData,
          password: userData.password ? "[REDACTED]" : undefined,
        });

        return {
          url: "/auth/profile",
          method: "PUT",
          data: userData,
        };
      },
      invalidatesTags: ["User"],
      transformResponse: (response) => {
        console.log("✅ Profile update successful:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("❌ Profile update error:", response);
        return response;
      },
    }),

    // Refresh token
    refreshToken: builder.mutation({
      query: () => {
        console.log("📤 Refresh token request being sent");

        return {
          url: "/auth/refresh",
          method: "POST",
        };
      },
      transformResponse: (response) => {
        console.log("✅ Token refresh successful");
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("❌ Token refresh error:", response);
        return response;
      },
    }),

    // Reset password request
    requestPasswordReset: builder.mutation({
      query: (email) => {
        console.log("📤 Password reset request for:", email);

        return {
          url: "/auth/forgot-password",
          method: "POST",
          data: { email },
        };
      },
      transformResponse: (response) => {
        console.log("✅ Password reset request successful:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("❌ Password reset request error:", response);
        return response;
      },
    }),

    // Reset password
    resetPassword: builder.mutation({
      query: ({ token, password, confirmPassword }) => {
        console.log("📤 Password reset with token");

        return {
          url: `/auth/reset-password/${token}`,
          method: "POST",
          data: { password, confirmPassword },
        };
      },
      transformResponse: (response) => {
        console.log("✅ Password reset successful:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("❌ Password reset error:", response);
        return response;
      },
    }),
  }),
});

// Export hooks for components to use
export const {
  useHealthCheckQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
  useRefreshTokenMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi;

// Export the API slice itself for store configuration
export default authApi;

// Log the current API configuration
console.log("🔧 API Configuration:", {
  baseUrl: getBaseUrl(),
  environment: import.meta.env.MODE,
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
});
