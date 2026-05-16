import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BrainCircuit } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <BrainCircuit className="logo-icon" size={32} />
          <span className="logo-text">LastMinute<span className="accent">.ai</span></span>
        </Link>

        <div className="nav-links desktop-only">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#demo">Demo</a>
          <a href="#pricing">Pricing</a>
        </div>

        <div className="nav-actions desktop-only">
          <Link to="/login" className="login-link">Log In</Link>
          <Link to="/signup" className="btn btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
        </div>

        <button 
          className="mobile-menu-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu glass-panel">
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#demo" onClick={() => setMobileMenuOpen(false)}>Demo</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
          <div className="mobile-actions">
            <Link to="/login" className="login-link" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
            <Link to="/signup" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
