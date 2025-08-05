import React from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  clearCredentials,
} from "../../redux/slicers/authSlice";
import { useLogoutUserMutation } from "../../redux/slicers/apiSlice";
import { authToast } from "../../utils/toast";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get auth state from Redux
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  // RTK Query logout mutation
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  // Handle logout with promise-based toast
  const handleLogout = async () => {
    try {
      // Use promise-based toast for logout
      await authToast.logoutPromise(logoutUser().unwrap());

      // Clear Redux state
      dispatch(clearCredentials());

      // Redirect to home
      navigate("/", { replace: true });
    } catch (error) {
      // Even if API fails, clear local state for security
      dispatch(clearCredentials());
      navigate("/", { replace: true });
      console.log(error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">MERN Auth</Link>
        </div>

        <nav className="nav">
          {isAuthenticated ? (
            // Authenticated user navigation
            <div className="nav-authenticated">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <div className="user-menu">
                <span className="user-name">
                  Welcome, {user?.username || "User"}
                </span>
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          ) : (
            // Guest navigation
            <div className="nav-guest">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link btn-primary">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
