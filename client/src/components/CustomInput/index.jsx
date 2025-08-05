import React, { useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiLock,
  FiImage,
} from "react-icons/fi";
import "./CustomInput.css";

const CustomInput = ({
  type = "text",
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = false,
  disabled = false,
  autoComplete,
  accept, // For file inputs
  icon: CustomIcon,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Auto-assign icons based on input name/type
  const getDefaultIcon = () => {
    switch (name) {
      case "username":
        return FiUser;
      case "email":
        return FiMail;
      case "password":
      case "confirmPassword":
      case "currentPassword":
      case "newPassword":
        return FiLock;
      case "avatar":
        return FiImage;
      default:
        return null;
    }
  };

  const IconComponent = CustomIcon || getDefaultIcon();
  const isPasswordType = type === "password";
  const isFileType = type === "file";
  const inputType = isPasswordType && showPassword ? "text" : type;

  // Handle file drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && onChange) {
      const event = {
        target: {
          name,
          files,
          value: files[0],
        },
      };
      onChange(event);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (onChange) {
      const event = {
        target: {
          name,
          value: file,
          files: e.target.files,
        },
      };
      onChange(event);
    }
  };

  // Regular input change handler
  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`custom-input-group ${className}`}>
      {label && (
        <label htmlFor={name} className="custom-input-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      <div
        className={`custom-input-wrapper ${error && touched ? "error" : ""} ${
          disabled ? "disabled" : ""
        }`}
      >
        {/* Icon */}
        {IconComponent && (
          <div className="input-icon">
            <IconComponent size={18} />
          </div>
        )}

        {/* File Input with Drag & Drop */}
        {isFileType ? (
          <div
            className={`file-input-container ${isDragOver ? "drag-over" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id={name}
              name={name}
              onChange={handleFileChange}
              onBlur={onBlur}
              accept={accept}
              disabled={disabled}
              className="file-input-hidden"
              {...props}
            />
            <label htmlFor={name} className="file-input-label">
              <FiImage size={24} />
              <span className="file-text">
                {value
                  ? value.name
                  : "Drop your avatar here or click to browse"}
              </span>
              <span className="file-subtext">PNG, JPG up to 5MB</span>
            </label>
          </div>
        ) : (
          /* Regular Input */
          <input
            type={inputType}
            id={name}
            name={name}
            value={value || ""}
            onChange={handleInputChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`custom-input ${IconComponent ? "has-icon" : ""} ${
              isPasswordType ? "has-toggle" : ""
            }`}
            aria-invalid={error && touched ? "true" : "false"}
            aria-describedby={error ? `${name}-error` : undefined}
            {...props}
          />
        )}

        {/* Password Toggle */}
        {isPasswordType && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && touched && (
        <span id={`${name}-error`} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default CustomInput;
