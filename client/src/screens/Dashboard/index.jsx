import "./Dashboard.css";

const Dashboard = () => {
  // TODO: Replace with actual user data from Redux
  const user = {
    username: "John Doe",
    email: "john@example.com",
    avatar: "default-avatar.png",
    role: "user",
    lastLogin: "2024-01-15T10:30:00Z",
    isVerified: true,
  };

  const stats = [
    {
      label: "Account Status",
      value: user.isVerified ? "Verified" : "Unverified",
      status: user.isVerified ? "success" : "warning",
    },
    { label: "Role", value: user.role, status: "info" },
    { label: "Member Since", value: "January 2024", status: "info" },
    { label: "Last Login", value: "Today", status: "success" },
  ];

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <div className="user-avatar">
              <img src={user.avatar} alt="User Avatar" />
            </div>
            <div className="welcome-text">
              <h1>Welcome back, {user.username}!</h1>
              <p>Here's what's happening with your account today.</p>
            </div>
          </div>
          <div className="quick-actions">
            <button className="btn btn-primary">Edit Profile</button>
            <button className="btn btn-secondary">Settings</button>
          </div>
        </div>

        <div className="dashboard-stats">
          <h2>Account Overview</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">{stat.label}</span>
                  <span className={`stat-status ${stat.status}`}></span>
                </div>
                <div className="stat-value">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Profile Information</h3>
                <button className="btn btn-small btn-outline">Edit</button>
              </div>
              <div className="card-content">
                <div className="info-row">
                  <span className="info-label">Username:</span>
                  <span className="info-value">{user.username}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Role:</span>
                  <span className="info-value">{user.role}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span
                    className={`info-value status ${
                      user.isVerified ? "verified" : "unverified"
                    }`}
                  >
                    {user.isVerified ? "✓ Verified" : "⚠ Unverified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>Security Settings</h3>
                <button className="btn btn-small btn-outline">Manage</button>
              </div>
              <div className="card-content">
                <div className="security-item">
                  <div className="security-info">
                    <h4>Password</h4>
                    <p>Last updated 30 days ago</p>
                  </div>
                  <span className="security-status good">Strong</span>
                </div>
                <div className="security-item">
                  <div className="security-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Not enabled</p>
                  </div>
                  <span className="security-status warning">Disabled</span>
                </div>
                <div className="security-item">
                  <div className="security-info">
                    <h4>Login Sessions</h4>
                    <p>1 active session</p>
                  </div>
                  <span className="security-status good">Secure</span>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>Recent Activity</h3>
                <button className="btn btn-small btn-outline">View All</button>
              </div>
              <div className="card-content">
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon login"></div>
                    <div className="activity-details">
                      <h4>Successful Login</h4>
                      <p>Today at 10:30 AM</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon update"></div>
                    <div className="activity-details">
                      <h4>Profile Updated</h4>
                      <p>Yesterday at 3:45 PM</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon security"></div>
                    <div className="activity-details">
                      <h4>Password Changed</h4>
                      <p>3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
