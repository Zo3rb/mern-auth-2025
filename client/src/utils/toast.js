import { toast } from "react-toastify";

export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
  info: (message) => toast.info(message),
  warning: (message) => toast.warning(message),
  dismiss: (toastId) => toast.dismiss(toastId),
  dismissAll: () => toast.dismiss(),
};

export const authToast = {
  loginSuccess: (username) => showToast.success(`Welcome back, ${username}!`),
  loginError: (message) => showToast.error(message || "Login failed"),

  registerSuccess: (username) =>
    showToast.success(`Welcome, ${username}! Account created successfully.`),
  registerError: (message) => showToast.error(message || "Registration failed"),

  logoutSuccess: () => showToast.success("Logged out successfully"),
  logoutError: () => showToast.error("Logout failed"),
};

export default showToast;
