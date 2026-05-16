import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    // Simulate real API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 2000);
  };

  if (isSent) {
    return (
      <div className="verification-success fade-in text-center">
        <div className="success-icon-wrapper">
          <CheckCircle2 size={64} className="text-green" />
        </div>
        <h1 className="auth-title">Check Your <span className="gradient-text">Email</span></h1>
        <p className="auth-subtitle">
          We've sent a password reset link to:<br/>
          <strong className="text-primary">{email}</strong>
        </p>
        <p className="text-secondary text-sm mt-4">
          Please follow the instructions in the email to reset your password.
        </p>
        <Link to="/login" className="btn btn-primary w-full mt-6" style={{ textDecoration: 'none' }}>
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="auth-header">
        <h1 className="auth-title">Reset <span className="gradient-text">Password</span></h1>
        <p className="auth-subtitle">Enter your email and we'll send you a recovery link.</p>
      </div>

      <form className="auth-form" onSubmit={handleReset} noValidate>
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <div className={`input-wrapper ${error ? 'error' : ''}`}>
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
          {error && <p className="error-message"><AlertCircle size={12} /> {error}</p>}
        </div>

        <button 
          type="submit" 
          className={`btn btn-primary w-full auth-submit-btn ${isLoading ? 'loading' : ''}`} 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="btn-spinner"></span>
          ) : (
            'Send Recovery Link'
          )}
        </button>
      </form>

      <div className="auth-footer">
        <Link to="/login" className="auth-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Back to login
        </Link>
      </div>
    </>
  );
};

export default ForgotPassword;
