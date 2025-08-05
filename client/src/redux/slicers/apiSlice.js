import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

// Custom axios base query function
const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers }, { getState }) => {
    try {
      // Get token from persisted state
      const token = getState()?.auth?.token;

      // Add token to headers if available
      const requestHeaders = {
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
      });

      console.log("✅ API Response Success:", result.data);
      return { data: result.data };
    } catch (axiosError) {
      console.error("❌ API Error:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
        url: baseUrl + url,
      });

      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

// Create the API
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Register user - Include confirmPassword
    registerUser: builder.mutation({
      query: (userData) => {
        // Only remove avatar, keep confirmPassword for backend validation
        const { avatar, ...cleanData } = userData;

        console.log("📤 Registration data being sent:", cleanData);
        console.log(
          "📤 Contains confirmPassword:",
          "confirmPassword" in cleanData
        );

        return {
          url: "/auth/register",
          method: "POST",
          data: cleanData, // Includes: username, email, password, confirmPassword
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["User"],
    }),

    // Login user
    loginUser: builder.mutation({
      query: (credentials) => {
        console.log("📤 Login credentials being sent:", {
          email: credentials.email,
          hasPassword: !!credentials.password,
        });

        return {
          url: "/auth/login",
          method: "POST",
          data: credentials,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["User"],
    }),

    // Logout user
    logoutUser: builder.mutation({
      query: () => {
        console.log("📤 Logout request being sent");

        return {
          url: "/auth/logout",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["User"],
    }),

    // Get current user profile
    getCurrentUser: builder.query({
      query: () => {
        console.log("📤 Get current user request being sent");

        return {
          url: "/auth/profile",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      providesTags: ["User"],
      // Automatically refetch when user logs in
      transformResponse: (response) => {
        console.log("✅ Current user data received:", response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("❌ Get current user error:", response);
        return response;
      },
    }),
  }),
});

// Export hooks for components to use
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetCurrentUserQuery,
} = authApi;

// Export the API slice itself for store configuration
export default authApi;
