import "./Profile.css";

const Profile = () => {
  // TODO: Get user data from Redux
  const user = {
    username: "johndoe",
    email: "john@example.com",
    avatar: "default-avatar.png",
    isVerified: true,
    role: "user",
    createdAt: "2024-01-15",
  };

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-header">
          <h1>Profile Settings</h1>
          <p>Manage your account information and preferences</p>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-avatar">
              <img src={user.avatar} alt="Profile" />
              <button className="btn btn-secondary">Change Avatar</button>
            </div>

            <div className="profile-info">
              <h3>{user.username}</h3>
              <p>{user.email}</p>
              <span
                className={`status ${
                  user.isVerified ? "verified" : "unverified"
                }`}
              >
                {user.isVerified ? "✓ Verified" : "⚠ Unverified"}
              </span>
            </div>
          </div>

          <div className="profile-main">
            <form className="profile-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      defaultValue={user.username}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" defaultValue={user.email} />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Security</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input type="password" id="currentPassword" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input type="password" id="newPassword" />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button type="button" className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
