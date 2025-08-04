import Hero from "../../components/Hero";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <Hero />

      <section className="features">
        <div className="container">
          <h2>Why Choose MERN Auth Boilerplate?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure Authentication</h3>
              <p>
                JWT-based authentication with HTTP-only cookies, password
                hashing, and secure session management.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>User Management</h3>
              <p>
                Complete user profile system with role-based access control and
                account verification.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Modern Stack</h3>
              <p>
                Built with MongoDB, Express.js, React, and Node.js using latest
                technologies and best practices.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Development</h3>
              <p>
                Pre-configured development environment with hot reloading and
                automated testing setup.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Security First</h3>
              <p>
                CORS protection, rate limiting, input validation, and XSS
                protection built-in.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>
                Mobile-first responsive design that works perfectly on all
                devices and screen sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>
              Join thousands of developers who trust our authentication
              boilerplate for their projects.
            </p>
            <div className="cta-buttons">
              <a href="/register" className="btn btn-primary btn-large">
                Start Building Now
              </a>
              <a
                href="https://github.com/yourusername/mern-auth-bp"
                className="btn btn-outline btn-large"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
