import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Award, BrainCircuit, Code2, Users, TrendingUp,
  Play, Zap, Clock, CheckCircle2, AlertTriangle, ChevronRight
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { useApp } from '../../context/AppContext';
import './Analytics.css';

const MODULE_COLORS = {
  'Mock Interview':  'var(--accent-cyan)',
  'Coding Round':    'var(--accent-purple)',
  'HR Round':        'var(--accent-pink)',
};

const Analytics = () => {
  const navigate  = useNavigate();
  const { state } = useApp();
const hasData =
  state.totalInterviews > 0 ||
  state.resumeAnalyzed ||
  state.atsScore > 0;
  const history = state.interviewHistory;

  // Build a simple line chart from history (reversed = chronological)
  const trendData = [...history].reverse().map((h, i) => ({
    name: `#${i + 1}`,
    score: h.score,
    type: h.type,
  }));

  // Per-module scores for bar chart
  const moduleScores = [
    { name: 'Mock',   score: state.mockScore   ?? 0, color: 'var(--accent-cyan)'   },
    { name: 'Coding', score: state.codingScore ?? 0, color: 'var(--accent-purple)' },
    { name: 'HR',     score: state.hrScore     ?? 0, color: 'var(--accent-pink)'   },
  ];

  // Radar using readiness breakdown
  const radarData = [
    { subject: 'Technical',     A: state.mockScore   ?? 0 },
    { subject: 'Coding',        A: state.codingScore ?? 0 },
    { subject: 'Communication', A: state.hrScore     ?? 0 },
    { subject: 'ATS Score',     A: state.atsScore    ?? 0 },
    { subject: 'AI Confidence', A: state.aiConfidence ?? 0 },
  ];

  return (
    <div className="analytics-page fade-in">
      <div className="page-header d-flex justify-between align-center">
        <div>
          <h1 className="page-title">Performance <span className="gradient-text">Analytics</span></h1>
          <p className="page-subtitle">
            {hasData 
              ? `${state.totalInterviews} session${state.totalInterviews !== 1 ? 's' : ''} completed — overall readiness: ${state.overallReadiness ?? '–'}%`
              : 'Complete interviews to see your analytics here.'}
          </p>
        </div>
      </div>

      {/* ── No data state ── */}
      {!hasData && !state.resumeAnalyzed && (
  <div className="empty-analytics glass-panel">
    <BarChart3 size={56} className="text-muted mb-3" />

    <h3>No Interview Data Yet</h3>

    <p className="text-secondary">
      Complete at least one interview module to start
      seeing live performance analytics.
    </p>

    <div className="empty-ctas">
      <button
        className="btn btn-primary"
        onClick={() => navigate('/dashboard/resume')}
      >
        <BrainCircuit size={18} />
        Analyze Resume First
      </button>

      <button
        className="btn btn-outline"
        onClick={() => navigate('/dashboard/mock')}
      >
        <Play size={18} />
        Start Mock Interview
      </button>
    </div>
  </div>
)}
{state.resumeAnalyzed && state.totalInterviews === 0 && (
  <div className="analytics-grid">

    {/* ATS HERO CARD */}
    <div className="analytics-card glass-panel col-span-2 premium-ats-card">

      <div className="ats-top">
        <div>
          <span className="premium-badge">
            AI Resume Intelligence
          </span>

          <h2>
            Resume <span>Analytics</span>
          </h2>

          <p>
            Your resume has been analyzed successfully.
            AI generated a complete readiness profile
            based on ATS, skills, formatting,
            communication, and role alignment.
          </p>
        </div>

        <div className="ats-score-circle">
          <div className="ats-inner">
            <h1>{state.atsScore || 82}</h1>
            <span>ATS Score</span>
          </div>
        </div>
      </div>

    </div>

    {/* ANALYTICS CARDS */}

    <div className="analytics-card glass-panel mini-premium-card">
      <div className="mini-icon cyan-glow">
        <CheckCircle2 size={22} />
      </div>

      <h3>Resume Strength</h3>

      <p>
        Strong keyword optimization and
        recruiter readability detected.
      </p>
    </div>

    <div className="analytics-card glass-panel mini-premium-card">
      <div className="mini-icon purple-glow">
        <TrendingUp size={22} />
      </div>

      <h3>Role Match</h3>

      <p>
        Resume aligns well with frontend,
        SaaS and AI-based product companies.
      </p>
    </div>

    <div className="analytics-card glass-panel mini-premium-card">
      <div className="mini-icon pink-glow">
        <BrainCircuit size={22} />
      </div>

      <h3>AI Confidence</h3>

      <p>
        AI predicts strong shortlisting chances
        after mock interview practice.
      </p>
    </div>

    <div className="analytics-card glass-panel mini-premium-card">
      <div className="mini-icon orange-glow">
        <AlertTriangle size={22} />
      </div>

      <h3>Weak Areas</h3>

      <p>
        Improve measurable achievements,
        project impact and leadership wording.
      </p>
    </div>

    {/* NEXT STEP PANEL */}

    <div className="analytics-card glass-panel col-span-2 next-step-panel">

      <div>
        <h2>Next Recommended Step</h2>

        <p>
          Start AI mock interviews to generate
          real-time behavioral and technical analytics.
        </p>
      </div>

      <button
        className="premium-start-btn"
        onClick={() => navigate('/dashboard/mock')}
      >
        <Play size={18} />
        Start Mock Interview
      </button>

    </div>

  </div>
)}
      {/* ── Analytics Grid ── */}
      {hasData && (
        <div className="analytics-grid">
          
          {/* Overall Readiness Score */}
          <div className="analytics-card glass-panel col-span-2">
            <h3 className="card-title"><Award size={18} className="text-cyan" /> Overall Readiness</h3>
            <div className="scores-container">
              <div className="score-ring-wrap main-score">
                <div className="score-ring" style={{ background: `conic-gradient(var(--accent-cyan) ${state.overallReadiness ?? 0}%, rgba(255,255,255,0.1) 0)` }}>
                  <div className="score-inner">
                    <h2>{state.overallReadiness ?? '–'}</h2>
                    <span>Ready</span>
                  </div>
                </div>
              </div>
              <div className="sub-scores">
                {moduleScores.map(m => (
                  <div key={m.name} className="sub-score-item">
                    <span className="sub-label">{m.name}</span>
                    <div className="progress-bg">
                      <div className="progress-fill" style={{ width: `${m.score}%`, background: m.color }}></div>
                    </div>
                    <span className="sub-val" style={{ color: m.color }}>{m.score > 0 ? `${m.score}%` : '–'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Score Trend */}
          <div className="analytics-card glass-panel">
            <h3 className="card-title"><TrendingUp size={18} className="text-purple" /> Score Trend</h3>
            {trendData.length > 1 ? (
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(10,10,20,0.9)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="score" stroke="var(--accent-cyan)" strokeWidth={2} dot={{ fill: 'var(--accent-cyan)', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="chart-placeholder"><p className="text-muted">Need 2+ sessions for trend data.</p></div>
            )}
          </div>

          {/* Module Bar Chart */}
          <div className="analytics-card glass-panel">
            <h3 className="card-title"><BarChart3 size={18} className="text-pink" /> Module Scores</h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(10,10,20,0.9)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {moduleScores.map((m, i) => <Cell key={i} fill={m.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar */}
          <div className="analytics-card glass-panel">
            <h3 className="card-title"><BrainCircuit size={18} className="text-cyan" /> Skill Profile</h3>
            <div style={{ height: 230 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <Radar name="You" dataKey="A" stroke="var(--accent-purple)" fill="var(--accent-purple)" fillOpacity={0.35} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(10,10,20,0.9)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Session History */}
          <div className="analytics-card glass-panel col-span-2">
            <h3 className="card-title"><Clock size={18} className="text-purple" /> Session History</h3>
            <div className="history-table">
              <div className="history-header">
                <span>Type</span><span>Score</span><span>Duration</span><span>Date</span>
              </div>
              {history.map((h, i) => (
                <div key={i} className="history-row">
                  <span className="history-type" style={{ color: MODULE_COLORS[h.type] ?? 'var(--text-secondary)' }}>{h.type}</span>
                  <span className="history-score">{h.score}/100</span>
                  <span className="history-dur text-muted">{h.duration}</span>
                  <span className="history-date text-muted">{h.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          {state.weakAreas?.length > 0 && (
            <div className="analytics-card glass-panel col-span-2 border-purple">
              <h3 className="card-title text-purple"><Zap size={18} /> AI Recommendations</h3>
              <div className="recs-flex">
                {state.weakAreas.map(area => (
                  <div key={area} className="rec-card glass-panel">
                    <AlertTriangle size={16} className="text-warning" />
                    <div>
                      <strong>Practice {area}</strong>
                      <p className="text-muted text-sm">Detected as a weak area from your resume analysis.</p>
                    </div>
                    <button className="btn btn-outline small ml-auto" onClick={() => navigate('/dashboard/panic')}>
                      Fix Now <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="action-panel col-span-2">
            <div className="action-buttons-grid">
              <button className="action-btn primary-action glass-panel" onClick={() => navigate('/dashboard/mock')}>
                <div className="action-icon"><Play size={24} /></div>
                <h4>New Mock Interview</h4>
                <p>Continue your preparation</p>
              </button>
              <button className="action-btn secondary-action glass-panel" onClick={() => navigate('/dashboard/coding')}>
                <div className="action-icon"><Code2 size={24} /></div>
                <h4>Coding Challenge</h4>
                <p>Improve your coding score</p>
              </button>
              <button className="action-btn panic-action glass-panel" onClick={() => navigate('/dashboard/panic')}>
                <div className="action-icon"><Zap size={24} /></div>
                <h4>Panic Mode</h4>
                <p>Focus on weak areas fast</p>
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Analytics;
