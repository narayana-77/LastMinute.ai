import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, Zap, Target, TrendingUp, Clock, ChevronRight,
  ShieldAlert, Code2, MessageSquare, Play, Star, CheckCircle2, MoreVertical
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './DashboardOverview.css';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  const stats = [
    { title: 'Readiness Score', value: `${state.readinessScore}%`, subtitle: 'Personalized AI Prediction', icon: Target, class: 'cyan-glow' },
    { title: 'Resume Score', value: `${state.atsScore || '--'}`, subtitle: 'ATS Optimization Rank', icon: BrainCircuit, class: 'purple-glow' },
    { title: 'Prep Sessions', value: state.totalInterviews || 0, subtitle: 'Modules Completed', icon: Clock, class: 'green-glow' },
    { title: 'AI Confidence', value: state.aiConfidence ? `${state.aiConfidence}%` : '--', subtitle: 'Pattern Match Rating', icon: Star, class: 'pink-glow' },
  ];

  const recentMocks = [
    { type: 'Technical', role: 'Frontend Engineer', score: 84, date: '2 days ago', status: 'Good' },
    { type: 'Coding', role: 'JavaScript Algos', score: 92, date: 'Yesterday', status: 'Excellent' },
    { type: 'HR', role: 'Behavioral Round', score: 78, date: '5 hours ago', status: 'Improving' },
  ];

  return (
    <div className="dashboard-overview fade-in">
      <div className="welcome-banner glass-panel">
        <div className="welcome-content">
          <h2>Welcome back, <span className="gradient-text">{state.userName || 'Candidate'}</span>!</h2>
          <p>Your interview readiness is increasing. You've completed 3 sessions this week.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard/resume')}>
          <Zap size={18} /> Update Profile
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className={`stat-card glass-panel ${stat.class}`}>
            <div className="stat-header">
              <div className="stat-icon-wrapper">
                <stat.icon size={20} />
              </div>
              <span className="stat-title">{stat.title}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-subtitle">{stat.subtitle}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="grid-col-left">
          {/* Resume Widget */}
          <div className="dashboard-widget glass-panel">
            <div className="widget-header">
              <div className="widget-title"><BrainCircuit size={20} className="text-purple" /> <h3>Resume Analysis</h3></div>
              <button className="btn-text-small" onClick={() => navigate('/dashboard/resume')}>View Report</button>
            </div>
            {state.resumeAnalyzed ? (
              <div className="resume-stats">
                <div className="ats-score">
                  <div className="circular-progress">
                    <span>{state.atsScore}</span>
                  </div>
                  <p>ATS Match</p>
                </div>
                <div className="resume-details">
                   <div className="detail-item">
                      <span className="detail-label"><Target size={14} /> Predicted Role</span>
                      <span className="detail-value">{state.predictedRole}</span>
                   </div>
                   <div className="detail-item">
                      <span className="detail-label"><TrendingUp size={14} /> Top Skills</span>
                      <div className="skill-tags">
                        {state.detectedSkills?.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
                      </div>
                   </div>
                   <div className="detail-item warning">
                      <span className="detail-label"><ShieldAlert size={14} /> Critical Weakness</span>
                      <span className="detail-value">{state.weakAreas?.[0] || 'None detected'}</span>
                   </div>
                </div>
              </div>
            ) : (
              <div className="empty-widget-state py-4 text-center">
                 <p className="text-muted mb-4">No resume data found. Upload to enable AI features.</p>
                 <button className="btn btn-outline" onClick={() => navigate('/dashboard/resume')}>Analyze Resume</button>
              </div>
            )}
          </div>

          {/* Recent Performance */}
          <div className="dashboard-widget glass-panel">
            <div className="widget-header">
              <div className="widget-title"><TrendingUp size={20} className="text-cyan" /> <h3>Recent Performance</h3></div>
              <button className="btn-text-small" onClick={() => navigate('/dashboard/analytics')}>Analytics</button>
            </div>
            <div className="recent-mocks-list">
              {recentMocks.map((mock, i) => (
                <div key={i} className="mock-card">
                  <div className="mock-info">
                    <h4>{mock.type} Round</h4>
                    <p className="mock-meta">{mock.role} • {mock.date}</p>
                  </div>
                  <div className="mock-score-wrap">
                    <span className={`score-badge ${mock.score > 80 ? 'good' : 'warning'}`}>{mock.score}%</span>
                    <button className="icon-btn-small"><ChevronRight size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="grid-col-right">
          {/* Panic Mode Widget */}
          <div className="dashboard-widget glass-panel panic-widget">
            <div className="widget-header border-none">
              <span className="badge-urgent">URGENT</span>
              <button className="icon-btn-small"><MoreVertical size={18} /></button>
            </div>
            <div className="upcoming-details mt-2">
              <h4>Interview Preparation</h4>
              <p className="text-secondary text-sm">Target: {state.targetCompany || 'Top Tech Companies'}</p>
              
              <div className="priority-topics">
                <p className="section-label">PRIORITY TOPICS</p>
                <ul>
                  <li><CheckCircle2 size={14} className="text-green" /> System Design Patterns</li>
                  <li><CheckCircle2 size={14} className="text-muted" /> Dynamic Programming</li>
                  <li><CheckCircle2 size={14} className="text-muted" /> Behavioral Questions</li>
                </ul>
              </div>

              <button className="btn btn-outline panic-btn w-full mt-3" onClick={() => navigate('/dashboard/panic')}>
                <Zap size={16} /> Activate Panic Mode
              </button>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="dashboard-widget glass-panel">
            <div className="widget-header">
              <div className="widget-title"><Star size={20} className="text-gold" /> <h3>AI Recommendations</h3></div>
            </div>
            <div className="recommendations-list">
              <div className="rec-item">
                <div className="rec-icon bg-purple-dim">
                  <Code2 className="text-purple" size={16} />
                </div>
                <div className="rec-content">
                  <h5>Focus on Micro-frontends</h5>
                  <p>Based on your last coding round, you could improve orchestration logic.</p>
                </div>
              </div>
              <div className="rec-item">
                <div className="rec-icon bg-cyan-dim">
                  <MessageSquare className="text-cyan" size={16} />
                </div>
                <div className="rec-content">
                  <h5>HR Mock Pending</h5>
                  <p>You haven't practiced behavioral rounds yet. Highly recommended for Senior roles.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-grid">
            <div className="quick-action-btn glass-panel" onClick={() => navigate('/dashboard/coding')}>
              <Code2 size={24} className="text-purple" />
              <span>Coding Round</span>
            </div>
            <div className="quick-action-btn glass-panel" onClick={() => navigate('/dashboard/mock')}>
              <Play size={24} className="text-cyan" />
              <span>Mock Round</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
