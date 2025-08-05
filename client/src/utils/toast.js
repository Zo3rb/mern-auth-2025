import { toast } from "react-toastify";

// Simple toast functions
export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
  info: (message) => toast.info(message),
  warning: (message) => toast.warning(message),
  dismiss: (toastId) => toast.dismiss(toastId),
  dismissAll: () => toast.dismiss(),

  // Promise-based toast for async operations
  promise: (promise, messages) => {
    return toast.promise(promise, {
      pending: messages.loading || "Loading...",
      success: messages.success || "Success!",
      error: messages.error || "Something went wrong!",
    });
  },
};

// Auth-specific messages
export const authToast = {
  // Login functions
  loginSuccess: (username) => showToast.success(`Welcome back, ${username}!`),
  loginError: (message) => showToast.error(message || "Login failed"),
  loginLoading: () => showToast.loading("Signing in..."),

  // Register functions
  registerSuccess: (username) =>
    showToast.success(`Welcome, ${username}! Account created successfully.`),
  registerError: (message) => showToast.error(message || "Registration failed"),
  registerLoading: () => showToast.loading("Creating account..."),

  // Logout functions
  logoutSuccess: () => showToast.success("Logged out successfully"),
  logoutError: () => showToast.error("Logout failed"),
  logoutLoading: () => showToast.loading("Logging out..."),

  // Promise-based functions
  registerPromise: (promise, username) => {
    return showToast.promise(promise, {
      loading: "Creating account...",
      success: `Welcome, ${username}! Account created successfully.`,
      error: "Registration failed. Please try again.",
    });
  },

  loginPromise: (promise) => {
    return toast.promise(promise, {
      pending: "Signing in...",
      success: (data) => `Welcome back, ${data.user?.username || "User"}!`,
      error: (error) => {
        const message =
          error?.data?.message ||
          error?.message ||
          "Login failed. Please check your credentials.";
        return message;
      },
    });
  },

  logoutPromise: (promise) => {
    return showToast.promise(promise, {
      loading: "Logging out...",
      success: "Logged out successfully",
      error: "Logout failed",
    });
  },
};

export default showToast;
