import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, Settings, BrainCircuit, Mic, MicOff, Video, PhoneOff,
  ChevronRight, Pause, CheckCircle2, AlertTriangle, Heart,
  Users, Award, Download, Zap, MessageSquare, Star, BarChart,
  Shield, ShieldAlert, Clock, Target, Volume2, TrendingUp
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip,
  ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Cell
} from 'recharts';
import { useApp, ACTIONS } from '../../context/AppContext';
import './HrInterview.css';

const radarData = [
  { subject: 'Confidence', A: 82, fullMark: 100 },
  { subject: 'Storytelling', A: 78, fullMark: 100 },
  { subject: 'Clarity', A: 88, fullMark: 100 },
  { subject: 'Empathy', A: 75, fullMark: 100 },
  { subject: 'Professionalism', A: 90, fullMark: 100 },
];

const fillerData = [
  { word: '"um"', count: 8 },
  { word: '"like"', count: 5 },
  { word: '"basically"', count: 3 },
  { word: '"you know"', count: 4 },
];

const hrQuestions = [
  { q: 'Tell me about yourself.', tag: 'Introduction', category: 'General' },
  { q: 'Why should we hire you over other candidates?', tag: 'Differentiation', category: 'Behavioral' },
  { q: 'Describe a conflict situation and how you resolved it.', tag: 'Conflict Resolution', category: 'STAR' },
  { q: 'What is your biggest weakness?', tag: 'Self-Awareness', category: 'Reflection' },
  { q: 'Where do you see yourself in 5 years?', tag: 'Career Goals', category: 'Vision' },
];

const HrInterview = () => {
  const navigate = useNavigate();
  const { state, dispatch, toast } = useApp();

  const [stage, setStage] = useState('setup');
  const [timer, setTimer] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [starPhase, setStarPhase] = useState(1); // 1-4 representing S, T, A, R
  const [emotionTone, setEmotionTone] = useState('Confident');

  const endSession = () => {
    const score = 84;
    dispatch({ type: ACTIONS.COMPLETE_HR, payload: { score, duration: formatTime(timer) } });
    toast(`🤝 HR session complete! Score: ${score}/100 saved.`, 'success');
    setStage('completion');
  };

  // Simulate emotion cycling in live mode
  useEffect(() => {
    let interval;
    if (stage === 'live') {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);

      const emotionCycle = setInterval(() => {
        const tones = ['Confident', 'Enthusiastic', 'Thoughtful', 'Composed'];
        setEmotionTone(tones[Math.floor(Math.random() * tones.length)]);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearInterval(emotionCycle);
      };
    }
  }, [stage]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleNextQuestion = () => {
    if (questionIdx < hrQuestions.length - 1) {
      setQuestionIdx(q => q + 1);
      setStarPhase(1);
    } else {
      endSession();
    }
  };

  // ─── STATE 1: SETUP ─────────────────────────────────────────────────────────
  if (stage === 'setup') {
    return (
      <div className="hr-page setup-view fade-in">
        <div className="page-header">
          <h1 className="page-title">HR <span className="gradient-text">Trainer</span></h1>
          <p className="page-subtitle">Configure your behavioral interview session and AI coaching parameters.</p>
        </div>

        <div className="setup-container">
          <form className="setup-form glass-panel" onSubmit={(e) => { e.preventDefault(); setStage('live'); }}>

            {/* Category */}
            <div className="form-section">
              <h3 className="section-title"><Users size={18} className="text-cyan" /> Interview Category</h3>
              <div className="input-group">
                <select className="auth-input" defaultValue="behavioral">
                  <option value="general">General HR Round</option>
                  <option value="behavioral">Behavioral Interview</option>
                  <option value="leadership">Leadership Round</option>
                  <option value="comm">Communication Practice</option>
                  <option value="intro">Self Introduction Practice</option>
                  <option value="managerial">Managerial Round</option>
                </select>
              </div>
              <div className="input-group mt-3">
                <label>Difficulty Level</label>
                <div className="radio-group">
                  {['Beginner', 'Intermediate', 'Advanced', 'Corporate'].map(d => (
                    <label key={d} className="radio-btn">
                      <input type="radio" name="diff" value={d.toLowerCase()} defaultChecked={d === 'Intermediate'} />
                      {d}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="form-section">
              <h3 className="section-title"><Target size={18} className="text-purple" /> Focus Areas</h3>
              <div className="checkbox-grid">
                {['Confidence Building', 'Storytelling (STAR)', 'Professional Communication', 'Emotional Tone', 'HR Question Mastery', 'Body Language'].map(f => (
                  <label key={f} className="checkbox-label">
                    <input type="checkbox" defaultChecked={['Confidence Building', 'Storytelling (STAR)'].includes(f)} />
                    {f}
                  </label>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="form-section">
              <h3 className="section-title"><Settings size={18} className="text-pink" /> Session Settings</h3>
              <div className="toggle-group">
                {[
                  { label: 'Webcam Posture Analysis', checked: true },
                  { label: 'Voice Emotion Analysis', checked: true },
                  { label: 'AI Follow-up Questions', checked: true },
                  { label: 'Timed Mode (3 min/question)', checked: false },
                ].map(s => (
                  <label key={s.label} className="toggle-item">
                    <span>{s.label}</span>
                    <input type="checkbox" className="toggle-checkbox" defaultChecked={s.checked} />
                  </label>
                ))}
              </div>
            </div>

            <div className="setup-actions">
              <button type="submit" className="btn btn-primary w-full pulse-btn">
                <Play size={18} /> Start HR Interview
              </button>
            </div>

          </form>
        </div>
      </div>
    );
  }

  // ─── STATE 2: LIVE ───────────────────────────────────────────────────────────
  if (stage === 'live') {
    const currentQ = hrQuestions[questionIdx];

    return (
      <div className="hr-page live-view fade-in">

        {/* Header */}
        <div className="workspace-header glass-panel">
          <div className="header-info">
            <div className="recording-indicator"><span className="dot red animate-pulse"></span> REC</div>
            <span className="live-title">Behavioral Interview — {currentQ.category}</span>
          </div>
          <div className="header-controls">
            <div className="timer-display text-cyan"><Clock size={16} /> {formatTime(timer)}</div>
            <div className="question-progress">Q {questionIdx + 1} / {hrQuestions.length}</div>
            <button className="btn-text-small text-pink" onClick={() => setStage('completion')}>End Session</button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="live-grid">

          {/* Left: AI Panel + Question + Transcript */}
          <div className="left-panel">

            {/* AI Interviewer */}
            <div className="ai-interviewer-card glass-panel">
              <div className="ai-avatar-wrap">
                <div className="ai-ring-outer animate-spin-slow"></div>
                <div className="ai-ring-inner animate-spin-reverse"></div>
                <div className="ai-face">HR</div>
              </div>
              <div className="ai-info">
                <h4>Sarah Chen</h4>
                <p className="ai-subtitle">Senior HR Manager, AI Simulation</p>
                <div className="emotion-pill">
                  <Heart size={12} className="text-pink animate-pulse" />
                  <span>{emotionTone}</span>
                </div>
              </div>
              <div className="voice-waves">
                <span className="wave"></span><span className="wave"></span><span className="wave"></span>
                <span className="wave"></span><span className="wave"></span>
              </div>
            </div>

            {/* Question Display */}
            <div className="question-card glass-panel">
              <div className="q-meta">
                <span className="q-badge hr">{currentQ.tag}</span>
                <span className="q-cat">{currentQ.category}</span>
              </div>
              <h3 className="current-q">"{currentQ.q}"</h3>
              {currentQ.category === 'STAR' && (
                <div className="star-hint">
                  <BrainCircuit size={14} className="text-purple" />
                  <span>AI Tip: Use the STAR method for this answer.</span>
                </div>
              )}
            </div>

            {/* Transcript */}
            <div className="transcript-card glass-panel">
              <div className="transcript-header">
                <MessageSquare size={16} className="text-cyan" />
                <span>Live Transcript</span>
              </div>
              <div className="chat-history">
                <div className="chat-msg ai-msg">
                  <strong>Sarah:</strong> Great, let's begin. {currentQ.q}
                </div>
                <div className="chat-msg user-msg">
                  <strong>You:</strong> <span className="text-muted">Listening...</span>
                  <span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Webcam + Analytics + STAR */}
          <div className="right-panel">

            {/* Webcam */}
            <div className="webcam-card glass-panel">
              <div className="panel-label">You — {isCamOn ? 'Camera On' : 'Camera Off'}</div>
              <div className="user-webcam-placeholder">
                <Video size={40} color="rgba(255,255,255,0.1)" />
                <div className="posture-badge">Posture: Upright ✓</div>
              </div>
              {isMicOn
                ? <div className="mic-status active"><Mic size={14} /></div>
                : <div className="mic-status muted"><MicOff size={14} /></div>
              }
            </div>

            {/* Live Behavioral Metrics */}
            <div className="behavioral-metrics glass-panel">
              <h4 className="metrics-title"><TrendingUp size={16} className="text-cyan" /> Live Analysis</h4>
              <div className="metrics-grid">
                <div className="bm-item">
                  <span>Confidence</span>
                  <div className="bm-bar"><div className="bm-fill" style={{ width: '82%', background: 'var(--accent-cyan)' }}></div></div>
                  <strong className="text-cyan">82%</strong>
                </div>
                <div className="bm-item">
                  <span>Clarity</span>
                  <div className="bm-bar"><div className="bm-fill" style={{ width: '88%', background: '#00FF66' }}></div></div>
                  <strong className="text-green">88%</strong>
                </div>
                <div className="bm-item">
                  <span>Emotional Tone</span>
                  <div className="bm-bar"><div className="bm-fill" style={{ width: '75%', background: 'var(--accent-purple)' }}></div></div>
                  <strong className="text-purple">75%</strong>
                </div>
                <div className="bm-item">
                  <span>Filler Words</span>
                  <div className="bm-bar"><div className="bm-fill" style={{ width: '40%', background: '#FFBD2E' }}></div></div>
                  <strong className="text-warning">Low ⚠</strong>
                </div>
              </div>
            </div>

            {/* STAR Method Coach */}
            <div className="star-coach glass-panel">
              <h4 className="metrics-title"><Star size={16} className="text-pink" /> STAR Method Coach</h4>
              <p className="star-subtitle">AI is evaluating your answer structure in real-time.</p>
              <div className="star-steps">
                {[
                  { key: 'S', label: 'Situation', desc: 'Set the context' },
                  { key: 'T', label: 'Task', desc: 'Define your role' },
                  { key: 'A', label: 'Action', desc: 'Steps you took' },
                  { key: 'R', label: 'Result', desc: 'Outcome achieved' },
                ].map((s, i) => (
                  <div
                    key={s.key}
                    className={`star-step ${starPhase > i ? 'completed' : starPhase === i + 1 ? 'active' : 'pending'}`}
                    onClick={() => setStarPhase(i + 1)}
                  >
                    <div className="star-key">{s.key}</div>
                    <div className="star-info">
                      <strong>{s.label}</strong>
                      <span>{s.desc}</span>
                    </div>
                    {starPhase > i && <CheckCircle2 size={16} className="star-check" />}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Controls */}
        <div className="live-controls glass-panel">
          <div className="control-group">
            <button className={`ctrl-btn ${isMicOn ? 'active' : 'danger'}`} onClick={() => setIsMicOn(!isMicOn)}>
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button className={`ctrl-btn ${isCamOn ? 'active' : 'danger'}`} onClick={() => setIsCamOn(!isCamOn)}>
              <Video size={20} />
            </button>
            <button className="ctrl-btn warning"><Pause size={20} /></button>
          </div>
          <div className="control-group">
            <button className="btn btn-outline" onClick={handleNextQuestion}>
              {questionIdx < hrQuestions.length - 1 ? 'Next Question' : 'Finish Interview'}
              <ChevronRight size={18} />
            </button>
            <button className="ctrl-btn danger end-call" onClick={() => setStage('completion')}>
              <PhoneOff size={20} />
            </button>
          </div>
        </div>

      </div>
    );
  }

  // ─── STATE 3: COMPLETION ─────────────────────────────────────────────────────
  return (
    <div className="hr-page completion-view fade-in">
      <div className="page-header d-flex justify-between align-center">
        <div>
          <h1 className="page-title">Behavioral <span className="gradient-text">Analysis</span></h1>
          <p className="page-subtitle">Your HR session is complete. Here is your AI-powered communication breakdown.</p>
        </div>
        <button className="btn btn-primary">
          <Download size={18} /> Export Report
        </button>
      </div>

      <div className="results-grid">

        {/* Overall Score */}
        <div className="result-card glass-panel col-span-2">
          <h3 className="card-title"><Award size={18} className="text-cyan" /> Overall HR Performance</h3>
          <div className="scores-container">
            <div className="score-ring-wrap main-score">
              <div className="score-ring" style={{ background: 'conic-gradient(var(--accent-cyan) 84%, rgba(255,255,255,0.1) 0)' }}>
                <div className="score-inner"><h2>84</h2><span>Total</span></div>
              </div>
            </div>
            <div className="sub-scores">
              {[
                { label: 'Confidence', val: '82%', pct: '82%', cls: 'bg-cyan', col: 'text-cyan' },
                { label: 'Storytelling', val: '78%', pct: '78%', cls: 'bg-purple', col: 'text-purple' },
                { label: 'Communication', val: '88%', pct: '88%', cls: 'bg-pink', col: 'text-pink' },
                { label: 'Emotional IQ', val: '75%', pct: '75%', cls: 'bg-green', col: 'text-green' },
              ].map(s => (
                <div key={s.label} className="sub-score-item">
                  <span className="sub-label">{s.label}</span>
                  <div className="progress-bg"><div className={`progress-fill ${s.cls}`} style={{ width: s.pct }}></div></div>
                  <span className={`sub-val ${s.col}`}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="result-card glass-panel">
          <h3 className="card-title"><BarChart size={18} className="text-purple" /> Communication Profile</h3>
          <div className="chart-container" style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                <Radar name="Score" dataKey="A" stroke="var(--accent-pink)" fill="var(--accent-pink)" fillOpacity={0.35} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10,10,20,0.9)', border: '1px solid var(--border-accent)', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filler Word Bar Chart */}
        <div className="result-card glass-panel">
          <h3 className="card-title"><AlertTriangle size={18} className="text-warning" /> Filler Word Usage</h3>
          <div className="chart-container" style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={fillerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="word" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(10,10,20,0.9)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {fillerData.map((_, i) => <Cell key={i} fill="rgba(255, 189, 46, 0.8)" />)}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* STAR Scores */}
        <div className="result-card glass-panel">
          <h3 className="card-title"><Star size={18} className="text-pink" /> STAR Method Compliance</h3>
          <div className="star-results">
            {[
              { key: 'S', label: 'Situation', score: 90, color: 'var(--accent-cyan)' },
              { key: 'T', label: 'Task', score: 85, color: 'var(--accent-purple)' },
              { key: 'A', label: 'Action', score: 80, color: 'var(--accent-pink)' },
              { key: 'R', label: 'Result', score: 70, color: '#FFBD2E' },
            ].map(s => (
              <div key={s.key} className="star-result-row">
                <div className="star-key-sm" style={{ background: `${s.color}22`, color: s.color }}>{s.key}</div>
                <span className="star-label">{s.label}</span>
                <div className="progress-bg flex-1"><div className="progress-fill" style={{ width: `${s.score}%`, background: s.color }}></div></div>
                <span style={{ color: s.color, fontWeight: 700, minWidth: '36px', textAlign: 'right' }}>{s.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="result-card glass-panel">
          <h3 className="card-title"><Shield size={18} className="text-cyan" /> Behavioral Indicators</h3>
          <div className="detail-metrics">
            {[
              { label: 'Eye Contact Consistency', value: 'Good (78%)', ok: true },
              { label: 'Speaking Speed (WPM)', value: '145 WPM — Moderate', ok: true },
              { label: 'Answer Depth', value: 'Needs more detail', ok: false },
              { label: 'Posture Analysis', value: 'Upright & confident', ok: true },
              { label: 'Hesitation Pauses', value: '6 detected', ok: false },
            ].map(m => (
              <div key={m.label} className="detail-metric-row">
                {m.ok
                  ? <CheckCircle2 size={16} className="text-green flex-shrink-0" />
                  : <AlertTriangle size={16} className="text-warning flex-shrink-0" />
                }
                <span className="dm-label">{m.label}</span>
                <span className={`dm-val ${m.ok ? 'text-secondary' : 'text-warning'}`}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Feedback Summary */}
        <div className="result-card glass-panel col-span-2 border-pink">
          <h3 className="card-title text-pink"><BrainCircuit size={18} /> AI Behavioral Feedback</h3>
          <div className="feedback-grid">
            <div className="feedback-col">
              <h4 className="text-green flex items-center gap-2"><CheckCircle2 size={16} /> Strengths</h4>
              <ul className="feedback-list">
                <li>Excellent professional tone and vocabulary throughout.</li>
                <li>Strong opening in the self-introduction — personal and structured.</li>
                <li>Good use of Situation & Action in the conflict resolution answer.</li>
              </ul>
            </div>
            <div className="feedback-col">
              <h4 className="text-warning flex items-center gap-2"><ShieldAlert size={16} /> Areas to Improve</h4>
              <ul className="feedback-list">
                <li>The "Result" phase of your STAR answers lacked quantifiable outcomes.</li>
                <li>Hesitation detected before answering weakness-related questions.</li>
                <li>Reduce filler words — "um" was detected 8 times in 15 minutes.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="action-panel col-span-2">
          <div className="action-buttons-grid">
            <button className="action-btn primary-action glass-panel" onClick={() => { setStage('setup'); setTimer(0); setQuestionIdx(0); }}>
              <div className="action-icon"><Play size={24} /></div>
              <h4>Retry HR Interview</h4>
              <p>Same category, new questions</p>
            </button>
            <button className="action-btn secondary-action glass-panel">
              <div className="action-icon"><Volume2 size={24} /></div>
              <h4>Practice Self Introduction</h4>
              <p>Drill the opener until perfect</p>
            </button>
            <button className="action-btn panic-action glass-panel">
              <div className="action-icon"><Zap size={24} /></div>
              <h4>Generate Panic Plan</h4>
              <p>Focus on weak areas only</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HrInterview;
