import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { selectCurrentUser } from "../../redux/slicers/authSlice";
import { showToast } from "../../utils/toast";
import CustomInput from "../../components/CustomInput";
import "./Profile.css";

const Profile = () => {
  const user = useSelector(selectCurrentUser);

  const [activeTab, setActiveTab] = useState("profile");

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
    watch: watchPassword,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Watch new password for confirmation validation
  const newPassword = watchPassword("newPassword");

  // Handle profile update (mock for now)
  const onProfileSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast.success("Profile updated successfully!");
      console.log("✅ Profile updated:", data);
    } catch {
      showToast.error("Failed to update profile");
      console.error("❌ Profile update error");
    }
  };

  // Handle password update (mock for now)
  const onPasswordSubmit = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast.success("Password updated successfully!");
      resetPasswordForm();
    } catch (error) {
      showToast.error("Failed to update password");
      console.error("❌ Password update error:", error);
    }
  };

  // Handle avatar upload (mock for now)
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      showToast.error("Image must be less than 5MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      showToast.error("Please upload a valid image (JPG, PNG, GIF)");
      return;
    }

    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast.success("Avatar updated successfully!");
    } catch {
      showToast.error("Failed to upload avatar");
    }
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
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="Profile"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => document.getElementById("avatar-upload").click()}
              >
                Change Avatar
              </button>
            </div>

            <div className="profile-info">
              <h3>{user?.username || "User"}</h3>
              <p>{user?.email || "No email"}</p>
              <span className="status verified">✓ Account Active</span>
              <div className="user-meta">
                <p>
                  <strong>Role:</strong> {user?.role || "User"}
                </p>
                <p>
                  <strong>Member since:</strong>{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="profile-tabs">
              <button
                className={`tab ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                Profile Info
              </button>
              <button
                className={`tab ${activeTab === "security" ? "active" : ""}`}
                onClick={() => setActiveTab("security")}
              >
                Security
              </button>
            </div>
          </div>

          <div className="profile-main">
            {activeTab === "profile" && (
              <form
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="profile-form"
              >
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <CustomInput
                        type="text"
                        label="Username"
                        {...registerProfile("username", {
                          required: "Username is required",
                          minLength: {
                            value: 3,
                            message: "Username must be at least 3 characters",
                          },
                        })}
                        error={profileErrors.username?.message}
                      />
                    </div>
                    <div className="form-group">
                      <CustomInput
                        type="email"
                        label="Email"
                        {...registerProfile("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email format",
                          },
                        })}
                        error={profileErrors.email?.message}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <CustomInput
                        type="text"
                        label="First Name"
                        {...registerProfile("firstName")}
                        error={profileErrors.firstName?.message}
                      />
                    </div>
                    <div className="form-group">
                      <CustomInput
                        type="text"
                        label="Last Name"
                        {...registerProfile("lastName")}
                        error={profileErrors.lastName?.message}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setProfileValue("username", user?.username || "");
                      setProfileValue("email", user?.email || "");
                    }}
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="profile-form"
              >
                <div className="form-section">
                  <h3>Change Password</h3>
                  <div className="form-group">
                    <CustomInput
                      type="password"
                      label="Current Password"
                      {...registerPassword("currentPassword", {
                        required: "Current password is required",
                      })}
                      error={passwordErrors.currentPassword?.message}
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <CustomInput
                        type="password"
                        label="New Password"
                        {...registerPassword("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                        error={passwordErrors.newPassword?.message}
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="form-group">
                      <CustomInput
                        type="password"
                        label="Confirm Password"
                        {...registerPassword("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === newPassword || "Passwords do not match",
                        })}
                        error={passwordErrors.confirmPassword?.message}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Update Password
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => resetPasswordForm()}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
