import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

// Custom axios base query function
const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        withCredentials: true, // Include cookies for authentication
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

// Create the API slice
export const authApi = createApi({
  reducerPath: "authApi", // Unique key for this API slice in the store
  baseQuery: axiosBaseQuery({
    baseUrl:
      import.meta.env.MODE === "development"
        ? "http://localhost:5000/api/v1"
        : "/api/v1",
  }),
  tagTypes: ["User"], // Cache tags for invalidation
  endpoints: (builder) => ({
    // Register user endpoint
    registerUser: builder.mutation({
      query: (userData) => {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("username", userData.username);
        formData.append("email", userData.email);
        formData.append("password", userData.password);
        formData.append("confirmPassword", userData.confirmPassword);

        // Add avatar if provided
        if (userData.avatar) {
          formData.append("avatar", userData.avatar);
        }

        return {
          url: "/auth/register",
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["User"], // Clear user cache after registration
    }),

    // Login user endpoint
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User"],
    }),

    // Logout user endpoint
    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // Get current user profile
    getCurrentUser: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"], // Provide cache tag
    }),
  }),
});

// Export auto-generated hooks for components to use
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetCurrentUserQuery,
} = authApi;
