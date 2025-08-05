import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { selectCurrentUser } from "../../redux/slicers/authSlice";
import "./Dashboard.css";

const Dashboard = () => {
  const user = useSelector(selectCurrentUser);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Mock stats data
  const stats = {
    totalLogins: Math.floor(Math.random() * 50) + 10,
    lastLogin: "Just now",
    accountAge: user?.createdAt
      ? Math.floor(
          (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
        )
      : Math.floor(Math.random() * 365),
    profileCompletion: 85,
  };

  // Mock activity data
  const activities = [
    {
      id: 1,
      action: "Logged in successfully",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "login",
    },
    {
      id: 2,
      action: "Profile viewed",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "view",
    },
    {
      id: 3,
      action: "Account created",
      timestamp: user?.createdAt
        ? new Date(user.createdAt)
        : new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      type: "create",
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: "Edit Profile",
      description: "Update your personal information",
      icon: "👤",
      link: "/profile",
      color: "blue",
    },
    {
      title: "Security Settings",
      description: "Manage your account security",
      icon: "🔒",
      link: "/profile",
      color: "green",
    },
    {
      title: "Account Settings",
      description: "Configure your preferences",
      icon: "⚙️",
      link: "/profile",
      color: "purple",
    },
    {
      title: "Help & Support",
      description: "Get help when you need it",
      icon: "❓",
      link: "#",
      color: "orange",
    },
  ];

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="dashboard">
      <div className="container">
        {/* Welcome Section */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>
              {getGreeting()}, {user?.username || "User"}! 👋
            </h1>
            <p className="welcome-subtitle">
              Welcome back to your dashboard. Here's what's happening with your
              account.
            </p>
            <div className="current-time">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              •{" "}
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          <div className="user-avatar-large">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="Profile"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div className="status-indicator online"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.totalLogins}</h3>
              <p>Total Logins</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🕒</div>
            <div className="stat-content">
              <h3>{stats.lastLogin}</h3>
              <p>Last Login</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>{stats.accountAge} days</h3>
              <p>Account Age</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.profileCompletion}%</h3>
              <p>Profile Complete</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`quick-action-card ${action.color}`}
                >
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-content">
                    <h3>{action.title}</h3>
                    <p>{action.description}</p>
                  </div>
                  <div className="action-arrow">→</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-type ${activity.type}`}>
                    {activity.type === "login" && "🔑"}
                    {activity.type === "view" && "👀"}
                    {activity.type === "create" && "🎉"}
                  </div>
                  <div className="activity-content">
                    <p>{activity.action}</p>
                    <small>{formatTimeAgo(activity.timestamp)}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Status */}
          <div className="dashboard-section">
            <h2>Account Status</h2>
            <div className="account-status">
              <div className="status-item">
                <span className="status-label">Account Status:</span>
                <span className="status-value verified">✅ Active</span>
              </div>
              <div className="status-item">
                <span className="status-label">Email:</span>
                <span className="status-value">
                  {user?.email || "Not provided"}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Username:</span>
                <span className="status-value">
                  {user?.username || "Not set"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
