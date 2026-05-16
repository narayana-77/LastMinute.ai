import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Code, Globe, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { useApp, ACTIONS } from '../../context/AppContext';
import TermsModal from '../../components/TermsModal';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // 'google' | 'github'
  const [showTerms, setShowTerms] = useState(false);
  
  const navigate = useNavigate();
  const { dispatch, toast } = useApp();

  const validate = () => {
    const newErrors = {};
    
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreed) {
      newErrors.agreed = 'You must agree to the Terms & Conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleSignup = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setIsLoading(true);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/signup",
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }
    );

    setIsLoading(false);

    toast("Account created successfully!", "success");

    navigate("/login");

  } catch (error) {
    setIsLoading(false);

    toast(
      error.response?.data?.message || "Signup failed",
      "error"
    );
  }
};

  const handleSocialAuth = (provider) => {
    setSocialLoading(provider);
    setTimeout(() => {
      setSocialLoading(null);
      toast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} auth pending backend integration.`, 'ai');
    }, 1500);
  };

  return (
    <>
      <div className="auth-header">
        <h1 className="auth-title">Create <span className="gradient-text">Account</span></h1>
        <p className="auth-subtitle">Join us to ace your next interview.</p>
      </div>

      <form className="auth-form" onSubmit={handleSignup} noValidate>
        {/* Name */}
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <div className={`input-wrapper ${errors.name ? 'error' : ''}`}>
            <User size={18} className="input-icon" />
            <input 
              type="text" 
              id="name" 
              className="auth-input" 
              placeholder="e.g. John Wick" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          {errors.name && <p className="error-message"><AlertCircle size={12} /> {errors.name}</p>}
        </div>

        {/* Email */}
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              id="email" 
              className="auth-input" 
              placeholder="you@company.com" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          {errors.email && <p className="error-message"><AlertCircle size={12} /> {errors.email}</p>}
        </div>

        {/* Password */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
            <Lock size={18} className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              className="auth-input" 
              placeholder="Min. 8 characters" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            <button 
              type="button" 
              className="password-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="error-message"><AlertCircle size={12} /> {errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
            <Shield size={18} className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              id="confirmPassword" 
              className="auth-input" 
              placeholder="Repeat your password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>
          {errors.confirmPassword && <p className="error-message"><AlertCircle size={12} /> {errors.confirmPassword}</p>}
        </div>

        {/* Terms */}
        <div className="form-options" style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <div className="checkbox-container">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                id="agreed"
                checked={formData.agreed}
                onChange={handleChange}
              /> 
              <span className="checkbox-text">
                I agree to the 
                <button type="button" onClick={() => setShowTerms(true)} className="auth-link-btn">Terms & Conditions</button>
              </span>
            </label>
            {errors.agreed && <p className="error-message mt-1"><AlertCircle size={12} /> {errors.agreed}</p>}
          </div>
        </div>

        <button 
          type="submit" 
          className={`btn btn-primary w-full auth-submit-btn ${isLoading ? 'loading' : ''}`} 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="btn-spinner"></span>
          ) : (
            <>Create Account <CheckCircle2 size={18} /></>
          )}
        </button>
      </form>

      <div className="auth-divider">OR CONTINUE WITH</div>

      <div className="social-auth">
        <button 
          className={`social-btn ${socialLoading === 'google' ? 'loading' : ''}`}
          onClick={() => handleSocialAuth('google')}
          disabled={!!socialLoading}
        >
          {socialLoading === 'google' ? <span className="btn-spinner"></span> : <><Globe size={18} /> Google</>}
        </button>
        <button 
          className={`social-btn ${socialLoading === 'github' ? 'loading' : ''}`}
          onClick={() => handleSocialAuth('github')}
          disabled={!!socialLoading}
        >
          {socialLoading === 'github' ? <span className="btn-spinner"></span> : <><Code size={18} /> GitHub</>}
        </button>
      </div>

      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
      </div>

      {showTerms && (
        <TermsModal 
          onClose={() => setShowTerms(false)} 
          onAccept={() => {
            setFormData(prev => ({ ...prev, agreed: true }));
            setShowTerms(false);
            if (errors.agreed) setErrors(prev => {
              const next = { ...prev };
              delete next.agreed;
              return next;
            });
          }} 
        />
      )}
    </>
  );
};

export default Signup;
