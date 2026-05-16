import { Outlet, Link } from 'react-router-dom';
import { BrainCircuit, Cpu } from 'lucide-react';
import './AuthStyles.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Left Panel - Illustration/Brand */}
      <div className="auth-left-panel">
        <div className="bg-glow"></div>
        <div className="bg-glow-right" style={{ bottom: '-100px', right: '-100px' }}></div>
        
        <div className="auth-brand">
          <Link to="/" className="logo">
            <BrainCircuit className="logo-icon" size={32} />
            <span className="logo-text">LastMinute<span className="accent">.ai</span></span>
          </Link>
        </div>
        
        <div className="auth-illustration">
          <div className="visual-core glass-panel animate-float">
            <div className="ai-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
            
            <div className="floating-badge badge-top glass-panel">
              <div className="dot green"></div>
              <span>Secured Environment</span>
            </div>
            
            <div className="floating-badge badge-bottom glass-panel">
              <Cpu size={16} color="var(--accent-cyan)" />
              <span>Identity Verified</span>
            </div>
          </div>
          
          <h2 className="auth-quote">
            "Your next big career move starts here."
          </h2>
          <p className="auth-subquote">
            Join thousands of candidates who secured their dream tech roles using our AI platform.
          </p>
        </div>
      </div>

      {/* Right Panel - Dynamic Form */}
      <div className="auth-right-panel">
        <div className="auth-form-container glass-panel">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
