import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, TrendingUp, Clock, ChevronRight, Star, FileText, 
  Sparkles, ArrowUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ErrorBoundary from '../../components/ErrorBoundary';
import brainHologram from '../../assets/brain_hologram.png';
import aiBot from '../../assets/ai_bot.png';
import './DashboardOverview.css';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // Shimmer duration
    return () => clearTimeout(timer);
  }, []);

  const userName = state?.userName || "Narayana Reddy Yaramala";

  if (loading) {
    return (
      <div className="dashboard-overview dashboard-skeleton-view fade-in">
        {/* Banner Skeleton */}
        <div className="welcome-banner skeleton-banner glass-panel">
          <div className="skeleton-welcome-left">
            <div className="skeleton-line skeleton-badge"></div>
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-subtitle"></div>
            <div className="skeleton-sub-panels">
              <div className="skeleton-panel"></div>
              <div className="skeleton-panel"></div>
            </div>
          </div>
          <div className="skeleton-welcome-right"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="stats-cards-grid">
          <div className="stat-card skeleton-card glass-panel"></div>
          <div className="stat-card skeleton-card glass-panel"></div>
          <div className="stat-card skeleton-card glass-panel"></div>
        </div>

        {/* Bottom Widgets Skeleton */}
        <div className="bottom-widgets-grid">
          <div className="bottom-card skeleton-card glass-panel"></div>
          <div className="bottom-card skeleton-card glass-panel"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-overview fade-in">
      {/* Hero Welcome Banner */}
      <ErrorBoundary title="Welcome Banner Error" fallbackText="The welcome dashboard section encountered a rendering error.">
        <div className="welcome-banner glass-panel">
          <div className="welcome-left">
            <div className="badge-career">
              <span role="img" aria-label="rocket" className="rocket-emoji">🚀</span> Keep building your career
            </div>
            <h2 className="welcome-title">
              Welcome back, <span className="gradient-name">{userName}</span>! 👋
            </h2>
            <p className="welcome-subtitle">
              Your interview readiness is improving every day. You've completed 3 sessions this week.
            </p>

            <div className="welcome-sub-panels">
              {/* Profile Completion */}
              <div className="sub-panel profile-completion">
                <span>Profile Completion</span>
                <div className="panel-header">
                  <span className="avatar-icon-mock">👤</span>
                  <div className="panel-info">
                    <span className="panel-value">65% Completed</span>
                  </div>
                </div>
                <div className="progress-track">
                  <div className="progress-bar" style={{ width: '65%' }}></div>
                </div>
              </div>

              {/* AI Tip */}
              <div className="sub-panel ai-tip">
                <span>AI TIP</span>
                <div className="panel-header">
                  <span className="tip-icon-mock">💡</span>
                  <div className="panel-info">
                    <span className="panel-value desc">Consistency builds confidence.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="welcome-right">
            <div className="hologram-podium-container">
              <div className="concentric-ring ring-outer"></div>
              <div className="concentric-ring ring-middle"></div>
              <div className="concentric-ring ring-inner"></div>
              <img src={brainHologram} alt="Brain Hologram" className="brain-image animate-float" />
              
              {/* Floating nodes with icons */}
              <div className="floating-node node-1">
                <Target size={16} color="#00F0FF" />
              </div>
              <div className="floating-node node-2">
                <FileText size={16} color="#7000FF" />
              </div>
              <div className="floating-node node-3">
                <TrendingUp size={16} color="#FF00E5" />
              </div>

             
            </div>
          </div>
        </div>
      </ErrorBoundary>

      {/* Core Stats Cards */}
      <div className="stats-cards-grid">
        {/* Card 1: Readiness Score */}
        <ErrorBoundary title="Readiness Score Error" fallbackText="Failed to load your Readiness Score.">
          <div className="stat-card glass-panel readiness-card">
            <div className="card-header">
              <div className="title-section">
                <Target size={18} className="icon-cyan" />
                <span>Readiness Score</span>
              </div>
              <svg className="sparkline" width="60" height="20" viewBox="0 0 60 20">
                <path d="M 0 15 Q 15 5 30 12 T 60 5" fill="none" stroke="#00F0FF" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="card-content-split">
              <div className="gauge-wrapper">
                <svg className="gauge-svg" width="84" height="84" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="gauge-bg" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    className="gauge-progress cyan-progress" 
                    style={{ 
                      strokeDashoffset: state?.overallReadiness 
                        ? 251.2 - (251.2 * Math.min(Math.max(state.overallReadiness, 0), 100)) / 100 
                        : 251.2 
                    }}
                  />
                </svg>
                <div className="gauge-value">{state?.overallReadiness != null ? `${state.overallReadiness}%` : '--'}</div>
              </div>
              <div className="card-details">
                <h4>Complete your profile</h4>
                <p>Add your skills & experience to get AI readiness score</p>
                <button className="card-action-btn btn-cyan" onClick={() => navigate('/dashboard/profile')}>
                  Complete Profile <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </ErrorBoundary>

        {/* Card 2: Resume Score */}
        <ErrorBoundary title="Resume Score Error" fallbackText="Failed to load your Resume Score.">
          <div className="stat-card glass-panel resume-card">
            <div className="card-header">
              <div className="title-section">
                <FileText size={18} className="icon-purple" />
                <span>Resume Score</span>
              </div>
              <svg className="sparkline" width="60" height="20" viewBox="0 0 60 20">
                <path d="M 0 8 Q 15 18 30 6 T 60 12" fill="none" stroke="#7000FF" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="card-content-split">
              <div className="gauge-wrapper">
                <svg className="gauge-svg" width="84" height="84" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="gauge-bg" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    className="gauge-progress purple-progress" 
                    style={{ 
                      strokeDashoffset: state?.atsScore 
                        ? 251.2 - (251.2 * Math.min(Math.max(state.atsScore, 0), 100)) / 100 
                        : 251.2 
                    }}
                  />
                </svg>
                <div className="gauge-value">{state?.atsScore != null ? state.atsScore : '--'}</div>
              </div>
              <div className="card-details">
                <h4>Upload your resume</h4>
                <p>Get AI-powered feedback and improve your score</p>
                <button className="card-action-btn btn-purple" onClick={() => navigate('/dashboard/resume')}>
                  Upload Resume <ArrowUp size={14} />
                </button>
              </div>
            </div>
          </div>
        </ErrorBoundary>

        {/* Card 3: Prep Sessions */}
        <ErrorBoundary title="Prep Sessions Error" fallbackText="Failed to load your Prep Sessions counter.">
          <div className="stat-card glass-panel prep-card">
            <div className="card-header">
              <div className="title-section">
                <Clock size={18} className="icon-green" />
                <span>Prep Sessions</span>
              </div>
              <svg className="sparkline" width="60" height="20" viewBox="0 0 60 20">
                <path d="M 0 15 Q 15 12 30 8 T 60 15" fill="none" stroke="#00FF66" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="card-content-split">
              <div className="sessions-counter">{state?.totalInterviews != null ? state.totalInterviews : 0}</div>
              <div className="card-details">
                <h4>No sessions Completed yet</h4>
                <p>Start your first mock interview to track your progress</p>
                <button className="card-action-btn btn-green" onClick={() => navigate('/dashboard/mock')}>
                  Start Mock <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>

      {/* Bottom Widgets */}
      <div className="bottom-widgets-grid">
        {/* Left: AI Confidence Radar */}
        <ErrorBoundary title="AI Confidence Radar Error" fallbackText="Failed to render AI Confidence metrics.">
          <div className="bottom-card glass-panel confidence-card">
            <div className="card-header">
              <div className="title-section">
                <Star size={18} fill="#7000FF" className="icon-purple" />
                <span>AI Confidence</span>
              </div>
            </div>
            <div className="widget-split">
              <div className="widget-info">
                <h4>Complete more sessions</h4>
                <p>Your AI confidence score will appear here as you practice more.</p>
              </div>
              <div className="radar-chart-container">
                <svg className="radar-svg" width="150" height="150" viewBox="0 0 120 120">
                  {/* Grid Rings */}
                  <polygon points="60,15 103,46 86,96 34,96 17,46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <polygon points="60,30 92,53 79,91 41,91 28,53" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <polygon points="60,45 81,61 73,85 47,85 39,61" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  
                  {/* Axis lines */}
                  <line x1="60" y1="65" x2="60" y2="15" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <line x1="60" y1="65" x2="103" y2="46" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <line x1="60" y1="65" x2="86" y2="96" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <line x1="60" y1="65" x2="34" y2="96" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <line x1="60" y1="65" x2="17" y2="46" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                  {/* Radar Area Polygon (Empty/Initial State) */}
                  <polygon points="60,48 76,57 70,77 50,77 44,57" fill="rgba(112, 0, 255, 0.25)" stroke="#7000FF" strokeWidth="1.5" />

                  {/* Axis Labels */}
                  <text x="60" y="10" textAnchor="middle" className="radar-label font-display-label">Communication</text>
                  <text x="105" y="44" textAnchor="start" className="radar-label font-display-label">Problem Solving</text>
                  <text x="89" y="104" textAnchor="start" className="radar-label font-display-label">Technical</text>
                  <text x="31" y="104" textAnchor="end" className="radar-label font-display-label">Behavioral</text>
                  <text x="14" y="44" textAnchor="end" className="radar-label font-display-label">Consistency</text>
                </svg>
              </div>
            </div>
          </div>
        </ErrorBoundary>

        {/* Right: Weekly Progress Bar Chart */}
        <ErrorBoundary title="Weekly Progress Error" fallbackText="Failed to render Weekly Progress stats.">
          <div className="bottom-card glass-panel progress-card">
            <div className="card-header">
              <div className="title-section">
                <TrendingUp size={18} className="icon-green" />
                <span>Weekly Progress</span>
              </div>
              <div className="time-filter-dropdown">
                This Week <span className="arrow-down">▾</span>
              </div>
            </div>
            <div className="widget-split">
              <div className="widget-info">
                <div className="big-counter">{state?.totalInterviews != null ? state.totalInterviews : 3}</div>
                <h4>Sessions Completed</h4>
                <div className="progress-status-badge">
                  <span className="target-dot">🎯</span> Keep it up!
                </div>
                <p>You're on the right track.</p>
              </div>
              <div className="bar-chart-container">
                <div className="bars-flex">
                  <div className="bar-col">
                    <div className="bar-track">
                      <div className="bar-fill blue-fill" style={{ height: '30%' }}></div>
                    </div>
                    <span className="bar-day">Mon</span>
                  </div>
                  <div className="bar-col">
                    <div className="bar-track">
                      <div className="bar-fill blue-fill" style={{ height: '55%' }}></div>
                    </div>
                    <span className="bar-day">Tue</span>
                  </div>
                  <div className="bar-col">
                    <div className="bar-track">
                      <div className="bar-fill purple-fill" style={{ height: '95%' }}></div>
                    </div>
                    <span className="bar-day">Wed</span>
                  </div>
                  <div className="bar-col">
                    <div className="bar-track">
                      <div className="bar-fill purple-fill" style={{ height: '45%' }}></div>
                    </div>
                    <span className="bar-day">Thu</span>
                  </div>
                  <div className="bar-col">
                    <div className="bar-track empty-track">
                      <div className="bar-dot"></div>
                    </div>
                    <span className="bar-day">Fri</span>
                  </div>
                  <div className="bar-col">
                    <div className="bar-track empty-track">
                      <div className="bar-dot"></div>
                    </div>
                    <span className="bar-day">Sat</span>
                  </div>
                  <div className="bar-col">
                    <div className="bar-track empty-track">
                      <div className="bar-dot"></div>
                    </div>
                    <span className="bar-day">Sun</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>

      {/* Guidance Bar */}
      <ErrorBoundary title="Guidance Bar Error" fallbackText="Guidance tip section encountered an error.">
        <div className="guidance-bar glass-panel">
          <div className="guidance-avatar-container">
            <img src={aiBot} alt="AI Assistant Avatar" className="guidance-avatar" />
          </div>
          <div className="guidance-text">
            <h3>Need guidance?</h3>
            <p>Ask our AI Assistant anything about interview preparation, resume improvement, or career tips.</p>
          </div>
          <div className="guidance-action">
            <button className="chat-ai-btn" onClick={() => {
              const event = new CustomEvent('openAIChat');
              window.dispatchEvent(event);
            }}>
              <Sparkles size={16} fill="white" /> Chat with AI Assistant
            </button>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default DashboardOverview;
