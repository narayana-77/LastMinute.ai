import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, Loader2, ArrowRight, RefreshCw, PencilLine } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const EmailVerification = () => {
  const [status, setStatus] = useState('sent'); // 'sent' | 'checking' | 'verified'
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const { state, toast } = useApp();

  // If no email in state, redirect to signup (prevent direct access)
  useEffect(() => {
    if (!state.userEmail && status !== 'verified') {
      // navigate('/signup');
    }
  }, [state.userEmail, status, navigate]);

  const handleCheckVerification = () => {
    setStatus('checking');
    
    // Simulate checking backend for verification status
    setTimeout(() => {
      // For demo: success after one check
      setStatus('verified');
      toast('Email verified successfully!', 'success');
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 2500);
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      toast('Verification email resent!', 'info');
    }, 1500);
  };

  const handleChangeEmail = () => {
    navigate('/signup');
  };

  if (status === 'verified') {
    return (
      <div className="verification-success fade-in text-center">
        <div className="success-icon-wrapper">
          <CheckCircle2 size={64} className="text-green" />
          <div className="confetti-effect"></div>
        </div>
        <h1 className="auth-title">Email <span className="gradient-text">Verified!</span></h1>
        <p className="auth-subtitle">
          Welcome aboard, <strong>{state.userName || 'User'}</strong>. Your account is now fully active.
        </p>
        <div className="loading-redirect mt-4">
          <Loader2 size={24} className="animate-spin text-cyan" />
          <span>Setting up your dashboard...</span>
        </div>
      </div>
    );
  }

  if (status === 'checking') {
    return (
      <div className="verification-checking fade-in text-center">
        <div className="checking-visual">
          <div className="pulse-ring"></div>
          <Mail size={48} className="text-cyan" />
        </div>
        <h1 className="auth-title">Checking <span className="gradient-text">Status</span></h1>
        <p className="auth-subtitle">
          We're verifying your email status with our servers. This will only take a moment.
        </p>
        <div className="checking-steps mt-4">
          <div className="step-item active">
            <CheckCircle2 size={14} className="text-green" />
            <span>Connecting to Auth Server</span>
          </div>
          <div className="step-item active">
            <Loader2 size={14} className="animate-spin text-cyan" />
            <span>Validating Token</span>
          </div>
          <div className="step-item">
            <div className="step-dot"></div>
            <span>Finalizing Session</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-sent fade-in">
      <div className="auth-header text-center">
        <div className="sent-icon-wrapper">
          <Mail size={48} className="text-cyan" />
          <div className="sent-ping"></div>
        </div>
        <h1 className="auth-title">Check Your <span className="gradient-text">Email</span></h1>
        <p className="auth-subtitle">
          We've sent a verification link to:<br />
          <strong className="text-primary">{state.userEmail || 'your-email@example.com'}</strong>
        </p>
      </div>

      <div className="verification-instructions glass-panel">
        <h4>Next Steps:</h4>
        <ol>
          <li>Open your email inbox</li>
          <li>Click the verification link in the email</li>
          <li>Return to this page to continue</li>
        </ol>
      </div>

      <div className="verification-actions">
        <button 
          className="btn btn-primary w-full mb-3" 
          onClick={handleCheckVerification}
        >
          I've Verified My Email <ArrowRight size={18} />
        </button>
        
        <div className="action-row">
          <button 
            className={`action-btn-small ${isResending ? 'disabled' : ''}`} 
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Resend Email
          </button>
          
          <button className="action-btn-small" onClick={handleChangeEmail}>
            <PencilLine size={14} />
            Change Email
          </button>
        </div>
      </div>

      <p className="verification-footer">
        Didn't see it? Check your spam folder or try resending.
      </p>
    </div>
  );
};

export default EmailVerification;
