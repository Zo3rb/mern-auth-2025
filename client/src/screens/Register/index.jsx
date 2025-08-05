import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import CustomInput from "../../components/CustomInput";
import { useRegisterUserMutation } from "../../redux/slicers/apiSlice";
import { setCredentials } from "../../redux/slicers/authSlice";
import { authToast } from "../../utils/toast";

import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // RTK Query mutation hook
  const [registerUser, { isLoading, error: apiError }] =
    useRegisterUserMutation();

  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
    setValue,
    trigger,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: null,
    },
  });

  // Watch password for confirm password validation
  const watchPassword = watch("password");
  const watchConfirmPassword = watch("confirmPassword");

  // Validation rules
  const validationRules = {
    username: {
      required: "Username is required",
      minLength: {
        value: 3,
        message: "Username must be at least 3 characters",
      },
      maxLength: {
        value: 20,
        message: "Username must be less than 20 characters",
      },
      pattern: {
        value: /^[a-zA-Z0-9_]+$/,
        message: "Username can only contain letters, numbers, and underscores",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Please enter a valid email address",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        message:
          "Password must contain uppercase, lowercase, number, and special character",
      },
    },
    confirmPassword: {
      required: "Please confirm your password",
      validate: (value) => {
        const password = getValues("password");
        return value === password || "Passwords do not match";
      },
    },
    avatar: {
      validate: (file) => {
        if (!file) return true;

        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
          return "Please upload a valid image file (JPG, PNG, GIF)";
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          return "Image size must be less than 5MB";
        }

        return true;
      },
    },
  };

  // Register fields with validation rules
  React.useEffect(() => {
    register("username", validationRules.username);
    register("email", validationRules.email);
    register("password", validationRules.password);
    register("confirmPassword", validationRules.confirmPassword);
    register("avatar", validationRules.avatar);
  }, [
    register,
    validationRules.username,
    validationRules.email,
    validationRules.password,
    validationRules.confirmPassword,
    validationRules.avatar,
  ]);

  // Handle form submission with Redux integration
  const onSubmit = async (data) => {
    setSubmitMessage("");

    try {
      // Use promise-based toast that handles loading/success/error automatically
      const result = await authToast.registerPromise(
        registerUser(data).unwrap(),
        data.username
      );

      console.log("✅ Registration successful:", result);

      // Set credentials in Redux state
      dispatch(
        setCredentials({
          user: result.user,
          token: result.token,
          refreshToken: result.refreshToken,
        })
      );

      // Set success message
      setSubmitMessage("🎉 Registration successful! Welcome aboard!");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
    } catch (error) {
      console.error("❌ Registration error:", error);

      // Extract error message
      let errorMessage = "Registration failed. Please try again.";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      // Set error message
      setSubmitMessage(errorMessage);
    }
  };

  // Handle input change for custom integration
  const handleInputChange = (fieldName) => (e) => {
    const { value, files } = e.target;

    if (fieldName === "avatar" && files) {
      setValue(fieldName, files[0], {
        shouldValidate: true,
        shouldTouch: true,
      });
    } else {
      setValue(fieldName, value, { shouldValidate: true, shouldTouch: true });
    }

    // Re-validate confirm password when password changes
    if (fieldName === "password" && watchConfirmPassword) {
      trigger("confirmPassword");
    }

    // Trigger validation for current field
    trigger(fieldName);
  };

  // Get validation state for visual feedback
  const getValidationState = (fieldName) => {
    const isTouched = touchedFields[fieldName];
    const hasError = errors[fieldName];

    if (!isTouched) return "";
    return hasError ? "error" : "success";
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>Create Your Account</h1>
            <p>
              Join us today and start your journey with secure authentication
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="register-form"
            noValidate
          >
            {/* Username Field */}
            <div className={`form-field ${getValidationState("username")}`}>
              <CustomInput
                type="text"
                name="username"
                label="Username"
                placeholder="Choose a unique username"
                value={watch("username")}
                onChange={handleInputChange("username")}
                error={errors.username?.message}
                touched={touchedFields.username}
                required
                autoComplete="username"
              />
              {touchedFields.username && !errors.username && (
                <div className="success-message">✓ Great username!</div>
              )}
            </div>

            {/* Email Field */}
            <div className={`form-field ${getValidationState("email")}`}>
              <CustomInput
                type="email"
                name="email"
                label="Email Address"
                placeholder="Enter your email address"
                value={watch("email")}
                onChange={handleInputChange("email")}
                error={errors.email?.message}
                touched={touchedFields.email}
                required
                autoComplete="email"
              />
              {touchedFields.email && !errors.email && (
                <div className="success-message">✓ Valid email address!</div>
              )}
            </div>

            {/* Password Field */}
            <div className={`form-field ${getValidationState("password")}`}>
              <CustomInput
                type="password"
                name="password"
                label="Password"
                placeholder="Create a strong password"
                value={watch("password")}
                onChange={handleInputChange("password")}
                error={errors.password?.message}
                touched={touchedFields.password}
                required
                autoComplete="new-password"
              />
              {touchedFields.password && !errors.password && (
                <div className="success-message">✓ Strong password!</div>
              )}

              {/* Password strength indicator */}
              {touchedFields.password && (
                <div className="password-requirements">
                  <h4>Password Requirements:</h4>
                  <ul>
                    <li
                      className={
                        watchPassword?.length >= 8 ? "valid" : "invalid"
                      }
                    >
                      At least 8 characters
                    </li>
                    <li
                      className={
                        /[a-z]/.test(watchPassword) ? "valid" : "invalid"
                      }
                    >
                      One lowercase letter
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(watchPassword) ? "valid" : "invalid"
                      }
                    >
                      One uppercase letter
                    </li>
                    <li
                      className={/\d/.test(watchPassword) ? "valid" : "invalid"}
                    >
                      One number
                    </li>
                    <li
                      className={
                        /[@$!%*?&]/.test(watchPassword) ? "valid" : "invalid"
                      }
                    >
                      One special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div
              className={`form-field ${getValidationState("confirmPassword")}`}
            >
              <CustomInput
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={watch("confirmPassword")}
                onChange={handleInputChange("confirmPassword")}
                error={errors.confirmPassword?.message}
                touched={touchedFields.confirmPassword}
                required
                autoComplete="new-password"
              />
              {touchedFields.confirmPassword && !errors.confirmPassword && (
                <div className="success-message">✓ Passwords match!</div>
              )}
            </div>

            {/* Avatar Field */}
            <div className={`form-field ${getValidationState("avatar")}`}>
              <CustomInput
                type="file"
                name="avatar"
                label="Profile Avatar (Optional)"
                accept="image/*"
                onChange={handleInputChange("avatar")}
                error={errors.avatar?.message}
                touched={touchedFields.avatar}
              />
              {touchedFields.avatar && !errors.avatar && (
                <div className="success-message">✓ Avatar uploaded!</div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`submit-btn ${isValid ? "valid" : "invalid"}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Submit Message */}
            {(submitMessage || apiError) && (
              <div
                className={`submit-message ${
                  submitMessage.includes("successful") ? "success" : "error"
                }`}
              >
                {submitMessage ||
                  apiError?.data?.message ||
                  "An error occurred"}
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="register-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
