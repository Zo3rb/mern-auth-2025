import React from "react";
import { Link } from "react-router";

import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Secure Authentication
              <span className="hero-highlight"> Made Simple</span>
            </h1>
            <p className="hero-description">
              A complete MERN stack authentication boilerplate with JWT, user
              management, and modern security practices. Get your application up
              and running in minutes.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Sign In
              </Link>
            </div>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">🔐</span>
                <span>JWT Authentication</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Fast & Secure</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚀</span>
                <span>Production Ready</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="card-header">
                <div className="card-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="card-title">Authentication Dashboard</span>
              </div>
              <div className="card-content">
                <div className="user-info">
                  <div className="avatar"></div>
                  <div className="user-details">
                    <div className="user-name"></div>
                    <div className="user-email"></div>
                  </div>
                </div>
                <div className="stats">
                  <div className="stat-item">
                    <div className="stat-value"></div>
                    <div className="stat-label"></div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value"></div>
                    <div className="stat-label"></div>
                  </div>
                </div>
                <div className="actions">
                  <div className="action-btn primary"></div>
                  <div className="action-btn secondary"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-bg">
        <div className="bg-gradient"></div>
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
