import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router"; // Using the correct import
import CustomInput from "../../components/CustomInput";

import "./Login.css";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
    setValue,
    trigger,
  } = useForm({
    mode: "onChange", // Real-time validation
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Validation rules
  const validationRules = {
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
        value: 6,
        message: "Password must be at least 6 characters",
      },
    },
  };

  // Register fields with validation rules
  React.useEffect(() => {
    register("email", validationRules.email);
    register("password", validationRules.password);
  }, [register]);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Log form data
      console.log("Login Data:", {
        email: data.email,
        password: data.password,
      });

      setSubmitMessage("Login successful! Redirecting to dashboard...");

      // TODO: Redirect to dashboard after successful login
      // setTimeout(() => {
      //   navigate("/dashboard");
      // }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setSubmitMessage(
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change for custom integration
  const handleInputChange = (fieldName) => (e) => {
    const { value } = e.target;
    setValue(fieldName, value, { shouldValidate: true, shouldTouch: true });
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
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="login-form"
            noValidate
          >
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
                placeholder="Enter your password"
                value={watch("password")}
                onChange={handleInputChange("password")}
                error={errors.password?.message}
                touched={touchedFields.password}
                required
                autoComplete="current-password"
              />
              {touchedFields.password && !errors.password && (
                <div className="success-message">✓ Password entered!</div>
              )}
            </div>

            {/* Additional Options */}
            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`submit-btn ${isValid ? "valid" : "invalid"}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`submit-message ${
                  submitMessage.includes("successful") ? "success" : "error"
                }`}
              >
                {submitMessage}
              </div>
            )}
          </form>

          {/* Social Login */}
          <div className="social-login">
            <div className="divider">
              <span>or continue with</span>
            </div>
            <div className="social-buttons">
              <button className="social-btn google-btn">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button className="social-btn github-btn">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
