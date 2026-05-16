import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Code, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp, ACTIONS } from '../../context/AppContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  
  const navigate = useNavigate();
  const { dispatch, toast } = useApp();

 const handleLogin = async (e) => {
  e.preventDefault();

  setError('');
  setEmailError('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    setEmailError('Please enter a valid email address');
    return;
  }

  if (!password) {
    setError('Please enter your password');
    return;
  }

  setIsLoading(true);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
      }
    );

    setIsLoading(false);

    // Store token
    localStorage.setItem("token", response.data.token);

    // Store user
    dispatch({
      type: ACTIONS.LOGIN,
      payload: response.data.user,
    });

    toast("Login successful!", "success");

    navigate("/dashboard");

  } catch (error) {
    setIsLoading(false);

    setError(
      error.response?.data?.message || "Login failed"
    );

    toast("Authentication failed", "error");
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
        <h1 className="auth-title">Welcome <span className="gradient-text">Back</span></h1>
        <p className="auth-subtitle">Enter your details to access your dashboard.</p>
      </div>

      <form className="auth-form" onSubmit={handleLogin} noValidate>
        {error && !emailError && <div className="general-error mb-4"><AlertCircle size={16} /> {error}</div>}
        
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <div className={`input-wrapper ${emailError ? 'error' : ''}`}>
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              id="email" 
              className="auth-input" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          {emailError && <p className="error-message"><AlertCircle size={12} /> {emailError}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className={`input-wrapper ${error ? 'error' : ''}`}>
            <Lock size={18} className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              className="auth-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input type="checkbox" /> <span className="checkbox-text">Remember me</span>
          </label>
          <Link to="/forgot-password" size={14} className="forgot-link">Forgot password?</Link>
        </div>

        <button 
          type="submit" 
          className={`btn btn-primary w-full auth-submit-btn ${isLoading ? 'loading' : ''}`} 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="btn-spinner"></span>
          ) : (
            <>Sign In <CheckCircle2 size={18} /></>
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
        Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
      </div>
    </>
  );
};

export default Login;
