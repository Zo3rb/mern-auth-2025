import { Link } from "react-router";
import "./Header.css";

const Header = () => {
  // TODO: Replace with actual auth state from Redux later
  const isAuthenticated = false; // Placeholder
  const user = null; // Placeholder

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
                <button className="logout-btn">Logout</button>
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
