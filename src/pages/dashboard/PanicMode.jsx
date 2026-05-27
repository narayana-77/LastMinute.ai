import { useState, useEffect } from 'react';
import {
  Zap, Clock, BrainCircuit, Target, AlertTriangle, CheckCircle2,
  Play, Code2, Users, Mic, Download, ChevronRight, Shield,
  TrendingUp, BarChart, Star, Flame, Award, RefreshCw, Calendar,
  BookOpen, MessageSquare, ShieldAlert, Heart, Coffee, Timer
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, Cell, Tooltip
} from 'recharts';
import './PanicMode.css';

const DEADLINES = [
  { id: 'tomorrow', label: 'Interview Tomorrow', days: 1, urgency: 'critical' },
  { id: '3days',    label: 'Interview in 3 Days', days: 3, urgency: 'high' },
  { id: '7days',    label: 'Interview in 7 Days', days: 7, urgency: 'medium' },
  { id: 'custom',   label: 'Custom Deadline',     days: null, urgency: 'custom' },
];

const readinessData = [
  { name: 'Technical', value: 72, fill: 'var(--accent-cyan)' },
  { name: 'HR',        value: 65, fill: 'var(--accent-purple)' },
  { name: 'Coding',    value: 80, fill: 'var(--accent-pink)' },
  { name: 'Comm.',     value: 58, fill: '#FFBD2E' },
];

const weaknessData = [
  { area: 'System Design', severity: 80 },
  { area: 'GraphQL',       severity: 65 },
  { area: 'STAR Method',   severity: 55 },
  { area: 'DSA Trees',     severity: 45 },
];

const dayPlans = {
  1: [
    { time: '6 AM – 8 AM',   task: 'Revise Core React Hooks & useState/useEffect',     done: false, type: 'tech' },
    { time: '8 AM – 9 AM',   task: 'Practice Self Introduction (3× iterations)',        done: false, type: 'hr'   },
    { time: '9 AM – 11 AM',  task: 'Solve 3 Medium DSA Problems (Arrays, HashMap)',     done: false, type: 'code' },
    { time: '11 AM – 12 PM', task: 'Mock HR Round — STAR method answers',               done: false, type: 'hr'   },
    { time: '12 PM – 2 PM',  task: 'Full Mock Interview Simulation',                    done: false, type: 'mock' },
    { time: '2 PM – 3 PM',   task: 'Revise Top 10 Project-based Questions',             done: false, type: 'proj' },
  ],
  3: [
    { time: 'Day 1 AM', task: 'Resume deep-dive + gap analysis + ATS fixes',           done: false, type: 'resume' },
    { time: 'Day 1 PM', task: 'Core technical revision — React, JS Concepts',           done: false, type: 'tech'  },
    { time: 'Day 2 AM', task: '5 DSA Coding Challenges (Easy + Medium)',                done: false, type: 'code'  },
    { time: 'Day 2 PM', task: 'HR Round practice — 10 behavioral questions',            done: false, type: 'hr'    },
    { time: 'Day 3 AM', task: 'Full Mock Interview (Tech + HR + Project)',              done: false, type: 'mock'  },
    { time: 'Day 3 PM', task: 'Weakness review + Final confidence-building session',   done: false, type: 'conf'  },
  ],
  7: [
    { time: 'Days 1–2', task: 'Resume & portfolio polish + gap analysis',              done: false, type: 'resume' },
    { time: 'Days 3–4', task: 'Deep technical revision (top 3 skill areas)',            done: false, type: 'tech'  },
    { time: 'Days 5–6', task: 'DSA coding sprints + System Design fundamentals',       done: false, type: 'code'  },
    { time: 'Day 6',    task: 'Complete HR simulation (STAR method mastery)',           done: false, type: 'hr'    },
    { time: 'Day 7',    task: 'Full-length mock interview + final review session',     done: false, type: 'mock'  },
  ],
};

const motivationalLines = [
  "You've got this! Every hour of focused prep compounds your confidence.",
  "Remember: preparation breeds confidence. You ARE ready for this.",
  "Top candidates prepare smarter, not harder. AI has your back today.",
  "Focus on your strengths first. Then patch the gaps systematically.",
];

const PanicMode = () => {
  const [stage, setStage]         = useState('entry');   // 'entry' | 'dashboard' | 'complete'
  const [selectedDeadline, setSelectedDeadline] = useState(DEADLINES[1]);
  const [company, setCompany]     = useState('');
  const [role, setRole]           = useState('');
  const [focus, setFocus]         = useState('full');
  const [countdown, setCountdown] = useState({ d: 0, h: 23, m: 0, s: 0 });
  const [tasks, setTasks]         = useState([]);
  const [motiveLine, setMotiveLine] = useState(motivationalLines[0]);
  const [readiness, setReadiness] = useState(68);
const [interviewType, setInterviewType] = useState("mixed");
  /* ── Countdown Tick ── */
  useEffect(() => {
    if (stage !== 'dashboard') return;
    const days = selectedDeadline.days ?? 3;
    const totalSec = days * 24 * 3600;
    let remaining = totalSec;

    const tick = setInterval(() => {
      remaining = Math.max(0, remaining - 1);
      setCountdown({
        d: Math.floor(remaining / 86400),
        h: Math.floor((remaining % 86400) / 3600),
        m: Math.floor((remaining % 3600) / 60),
        s: remaining % 60,
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [stage]);

  /* ── Motivation cycle ── */
  useEffect(() => {
    if (stage !== 'dashboard') return;
    const cyc = setInterval(() => {
      setMotiveLine(motivationalLines[Math.floor(Math.random() * motivationalLines.length)]);
    }, 8000);
    return () => clearInterval(cyc);
  }, [stage]);

  /* ── Init tasks from deadline ── */
  const handleGenerate = (e) => {
    e.preventDefault();
    const days = selectedDeadline.days ?? 3;
    const plan = days >= 7 ? dayPlans[7] : days >= 3 ? dayPlans[3] : dayPlans[1];
    setTasks(plan.map(t => ({ ...t })));
    setStage('dashboard');
  };

  const toggleTask = (idx) => {
    setTasks(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], done: !next[idx].done };
      const pct = Math.round((next.filter(t => t.done).length / next.length) * 100);
      setReadiness(Math.min(95, 68 + Math.round(pct * 0.27)));
      return next;
    });
  };

  const pad = (n) => String(n).padStart(2, '0');

  // ─── Entry Screen ────────────────────────────────────────────────────────────
  if (stage === 'entry') {
    return (
      <div className="panic-page entry-view fade-in">
        {/* Glowing BG pulse */}
        <div className="panic-bg-glow"></div>

        <div className="entry-hero">
          <div className="panic-badge"><Flame size={16} className="animate-pulse" /> PANIC MODE</div>
          <h1 className="entry-title">
            Interview <span className="gradient-text-fire">Emergency</span>
            <br />Preparation
          </h1>
          <p className="entry-subtitle">
            AI will generate a laser-focused preparation plan based on your deadline,
            target role, and detected skill gaps.
          </p>
        </div>

        <form className="entry-form glass-panel panic-border" onSubmit={handleGenerate}>

          {/* Deadline Selection */}
          <div className="form-section">
            <h3 className="section-title"><Timer size={18} className="text-fire" /> How much time do you have?</h3>
            <div className="deadline-grid">
              {DEADLINES.map(d => (
                <button
                  type="button"
                  key={d.id}
                  className={`deadline-btn glass-panel ${selectedDeadline.id === d.id ? 'selected' : ''} ${d.urgency}`}
                  onClick={() => setSelectedDeadline(d)}
                >
                  <span className="dl-label">{d.label}</span>
                  {d.days && <span className="dl-days">{d.days}d left</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Target Input */}
          <div className="form-section">
            <h3 className="section-title"><Target size={18} className="text-cyan" /> Interview Target</h3>
            <div className="two-col-inputs">
              <div className="input-wrapper">
                <BrainCircuit size={18} className="input-icon" />
                <input
                  className="auth-input"
                  placeholder="Company Name (e.g., Google)"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                />
              </div>
              <div className="input-wrapper">
                <Target size={18} className="input-icon" />
                <input
                  className="auth-input"
                  placeholder="Role (e.g., Senior Frontend Engineer)"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                />
              </div>
            </div>
            <div className="input-group mt-3">
  <div className="panic-select-wrapper">

    <select
      className="panic-select"
      value={interviewType}
      onChange={(e) => setInterviewType(e.target.value)}
    >
      <option value="mixed">
        Mixed Interview (Tech + HR + Coding)
      </option>

      <option value="tech">
        Technical Round Only
      </option>

      <option value="hr">
        HR / Behavioral Only
      </option>

      <option value="coding">
        Live Coding Only
      </option>
    </select>

  </div>
</div>
          </div>

          {/* Focus */}
          <div className="form-section">
            <h3 className="section-title"><Zap size={18} className="text-purple" /> Preparation Focus</h3>
            <div className="focus-grid">
              {[
                { id: 'full',  label: 'Full Preparation',   icon: <Star size={18} />     },
                { id: 'tech',  label: 'Technical Focus',    icon: <Code2 size={18} />    },
                { id: 'hr',    label: 'HR Focus',           icon: <Users size={18} />    },
                { id: 'code',  label: 'Coding Sprint',      icon: <BrainCircuit size={18} /> },
                { id: 'comm',  label: 'Communication',      icon: <MessageSquare size={18} /> },
              ].map(f => (
                <button
                  type="button"
                  key={f.id}
                  className={`focus-btn glass-panel ${focus === f.id ? 'selected' : ''}`}
                  onClick={() => setFocus(f.id)}
                >
                  {f.icon}
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn panic-cta-btn w-full">
            <Zap size={20} /> Generate Emergency Prep Plan
          </button>
        </form>
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────────
  if (stage === 'dashboard') {
    const donePct = tasks.length ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0;
    const urgency = selectedDeadline.urgency;

    return (
      <div className="panic-page dashboard-view fade-in">
        <div className="panic-bg-glow"></div>

        {/* Header */}
        <div className={`panic-header glass-panel panic-border-${urgency}`}>
          <div className="panic-header-left">
            <div className="panic-badge"><Flame size={14} className="animate-pulse" /> PANIC MODE ACTIVE</div>
            <h2>{company || 'Target Company'} — {role || 'Target Role'}</h2>
          </div>
          <div className="panic-header-right">
            <button className="btn-text-small text-muted" onClick={() => setStage('entry')}>Reconfigure</button>
            <button className="btn btn-primary small" onClick={() => setStage('complete')}>
              Mark Ready <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="dashboard-main-grid">

          {/* ── Left column ── */}
          <div className="left-col">

            {/* Countdown */}
            <div className={`countdown-card glass-panel panic-border-${urgency}`}>
              <h3 className="widget-title"><Clock size={16} className="text-fire" /> Time Remaining</h3>
              <div className="countdown-blocks">
                {[
                  { val: countdown.d, label: 'Days' },
                  { val: countdown.h, label: 'Hours' },
                  { val: countdown.m, label: 'Mins' },
                  { val: countdown.s, label: 'Secs' },
                ].map(({ val, label }) => (
                  <div key={label} className="cd-unit">
                    <div className="cd-num">{pad(val)}</div>
                    <div className="cd-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Readiness + Radial */}
            <div className="readiness-card glass-panel">
              <h3 className="widget-title"><TrendingUp size={16} className="text-cyan" /> AI Readiness Score</h3>
              <div className="readiness-body">
                <div className="radial-wrap" style={{ height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="60%"
                      outerRadius="90%"
                      data={[{ value: readiness, fill: 'var(--accent-cyan)' }]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar minAngle={15} background dataKey="value" cornerRadius={6} />
                      <text
                        x="50%" y="50%"
                        textAnchor="middle" dominantBaseline="middle"
                        fill="white"
                        fontSize="1.8rem"
                        fontWeight="700"
                        fontFamily="var(--font-display)"
                      >{readiness}%</text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="readiness-breakdown">
                  {readinessData.map(r => (
                    <div key={r.name} className="rb-row">
                      <span className="rb-label">{r.name}</span>
                      <div className="progress-bg">
                        <div className="progress-fill" style={{ width: `${r.value}%`, background: r.fill }}></div>
                      </div>
                      <span className="rb-val" style={{ color: r.fill }}>{r.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weakness Panel */}
            <div className="weakness-panel glass-panel border-warning">
              <h3 className="widget-title text-warning"><ShieldAlert size={16} /> Critical Weak Areas</h3>
              <div className="weakness-bars">
                {weaknessData.map(w => (
                  <div key={w.area} className="wb-row">
                    <span className="wb-label">{w.area}</span>
                    <div className="progress-bg">
                      <div className="progress-fill" style={{ width: `${w.severity}%`, background: `rgba(255,189,46,${w.severity / 100 + 0.2})` }}></div>
                    </div>
                    <span className="wb-val text-warning">{w.severity}%</span>
                  </div>
                ))}
              </div>
              <p className="weakness-note mt-3">Severity = AI-detected gap vs. role requirements.</p>
            </div>

            {/* Quick Practice */}
            <div className="quick-practice-card glass-panel">
              <h3 className="widget-title"><Zap size={16} className="text-purple" /> Quick Practice</h3>
              <div className="quick-btns">
                {[
                  { label: 'Rapid Mock',   icon: <Play size={16} />,       col: 'text-cyan'   },
                  { label: 'Coding Round', icon: <Code2 size={16} />,      col: 'text-purple' },
                  { label: 'HR Lightning', icon: <Users size={16} />,      col: 'text-pink'   },
                  { label: 'Self Intro',   icon: <Mic size={16} />,        col: 'text-green'  },
                  { label: 'AI Flash Rev', icon: <BrainCircuit size={16}/>,col: 'text-warning'},
                ].map(b => (
                  <button key={b.label} className={`quick-btn glass-panel ${b.col}`}>
                    {b.icon} {b.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right column ── */}
          <div className="right-col">

            {/* Priority Topics */}
            <div className="priority-topics-card glass-panel">
              <h3 className="widget-title"><Star size={16} className="text-pink" /> High-Priority Topics</h3>
              <div className="topics-grid">
                {[
                  { topic: 'React Hooks Deep Dive',       urgency: 'critical', domain: 'Tech'   },
                  { topic: 'STAR Method Mastery',          urgency: 'high',     domain: 'HR'     },
                  { topic: 'Array + HashMap Patterns',     urgency: 'critical', domain: 'DSA'    },
                  { topic: 'System Design Fundamentals',   urgency: 'high',     domain: 'Tech'   },
                  { topic: 'Project Deep Explanations',    urgency: 'medium',   domain: 'Proj'   },
                  { topic: 'Async JS & Promises',          urgency: 'high',     domain: 'Tech'   },
                ].map(t => (
                  <div key={t.topic} className={`topic-card glass-panel urgency-${t.urgency}`}>
                    <div className="topic-domain">{t.domain}</div>
                    <p className="topic-name">{t.topic}</p>
                    <div className={`urgency-dot ${t.urgency}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Questions */}
            <div className="expected-q-card glass-panel">
              <h3 className="widget-title"><MessageSquare size={16} className="text-cyan" /> Most Expected Questions</h3>
              <div className="questions-scroll">
                {[
                  { q: 'Explain React reconciliation and the virtual DOM.',       tag: 'Technical', color: 'cyan'   },
                  { q: 'Tell me about yourself in 90 seconds.',                   tag: 'HR',        color: 'purple' },
                  { q: 'Two Sum problem — optimal solution?',                     tag: 'Coding',    color: 'pink'   },
                  { q: 'Describe a time you led a project under pressure.',       tag: 'STAR',      color: 'warning'},
                  { q: 'How does useEffect differ from componentDidMount?',       tag: 'Technical', color: 'cyan'   },
                  { q: 'What is your biggest weakness?',                          tag: 'HR',        color: 'purple' },
                ].map((item, i) => (
                  <div key={i} className={`eq-row eq-${item.color}`}>
                    <span className={`eq-tag tag-${item.color}`}>{item.tag}</span>
                    <p className="eq-q">{item.q}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Day-wise Roadmap */}
            <div className="roadmap-card glass-panel">
              <div className="roadmap-header">
                <h3 className="widget-title"><Calendar size={16} className="text-purple" /> Prep Roadmap</h3>
                <span className="roadmap-pct">{donePct}% complete</span>
              </div>
              <div className="progress-bg mb-3">
                <div className="progress-fill bg-purple" style={{ width: `${donePct}%`, transition: 'width 0.5s ease' }}></div>
              </div>
              <div className="roadmap-tasks">
                {tasks.map((t, idx) => (
                  <div key={idx} className={`roadmap-task ${t.done ? 'done' : ''} type-${t.type}`} onClick={() => toggleTask(idx)}>
                    <div className="task-check">{t.done ? <CheckCircle2 size={16} className="text-green" /> : <div className="task-circle"></div>}</div>
                    <div className="task-body">
                      <span className="task-time">{t.time}</span>
                      <p className="task-text">{t.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Motivator */}
            <div className="motivator-card glass-panel border-purple">
              <div className="motivator-inner">
                <div className="motivator-avatar">
                  <Heart size={22} className="text-pink animate-pulse" />
                </div>
                <div className="motivator-content">
                  <h4>AI Motivator</h4>
                  <p className="motivator-text fade-in">{motiveLine}</p>
                </div>
              </div>
              <div className="ai-recs mt-3">
                <p className="rec-title">Smart Recommendations:</p>
                <div className="recs-grid">
                  {['Revise React Hooks', 'Practice Self Intro', 'Solve 3 Hash Map problems', 'Improve STAR answers'].map(r => (
                    <div key={r} className="rec-chip"><ChevronRight size={12} /> {r}</div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ─── Completion ───────────────────────────────────────────────────────────────
  return (
    <div className="panic-page completion-view fade-in">
      <div className="panic-bg-glow"></div>

      <div className="completion-hero">
        <div className="completion-icon"><Award size={48} className="text-cyan animate-pulse" /></div>
        <h1 className="completion-title">You Are <span className="gradient-text">Interview-Ready!</span></h1>
        <p className="completion-subtitle">AI has assessed your preparation and generated your final readiness report.</p>
      </div>

      <div className="results-grid">

        {/* Final Readiness */}
        <div className="result-card glass-panel col-span-2">
          <h3 className="card-title"><Award size={18} className="text-cyan" /> Final Readiness Score</h3>
          <div className="scores-container">
            <div className="score-ring-wrap main-score">
              <div className="score-ring panic-ring">
                <div className="score-inner"><h2>{readiness}</h2><span>Ready</span></div>
              </div>
            </div>
            <div className="sub-scores">
              {[
                { label: 'Technical',      val: '82%', pct: '82%', col: 'bg-cyan',   tcol: 'text-cyan'   },
                { label: 'Coding',         val: '80%', pct: '80%', col: 'bg-purple', tcol: 'text-purple' },
                { label: 'Communication',  val: '70%', pct: '70%', col: 'bg-pink',   tcol: 'text-pink'   },
                { label: 'Confidence',     val: '75%', pct: '75%', col: 'bg-green',  tcol: 'text-green'  },
              ].map(s => (
                <div key={s.label} className="sub-score-item">
                  <span className="sub-label">{s.label}</span>
                  <div className="progress-bg"><div className={`progress-fill ${s.col}`} style={{ width: s.pct }}></div></div>
                  <span className={`sub-val ${s.tcol}`}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final Checklist */}
        <div className="result-card glass-panel">
          <h3 className="card-title"><CheckCircle2 size={18} className="text-green" /> Final Interview Checklist</h3>
          <div className="checklist">
            {[
              { item: 'Resume reviewed & ATS optimized',      ok: true  },
              { item: 'Top 10 technical questions prepared',   ok: true  },
              { item: 'Self introduction polished',            ok: true  },
              { item: 'STAR method answers rehearsed',         ok: false },
              { item: 'System Design concepts revised',        ok: false },
              { item: 'Mock interview completed',              ok: true  },
              { item: 'Technical environment tested',          ok: true  },
            ].map(c => (
              <div key={c.item} className={`check-row ${c.ok ? 'done' : 'pending'}`}>
                {c.ok
                  ? <CheckCircle2 size={16} className="text-green flex-shrink-0" />
                  : <AlertTriangle size={16} className="text-warning flex-shrink-0" />
                }
                <span>{c.item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Remaining Weaknesses */}
        <div className="result-card glass-panel border-warning">
          <h3 className="card-title text-warning"><ShieldAlert size={18} /> Remaining Weak Areas</h3>
          <div className="weakness-bars">
            {weaknessData.slice(0, 3).map(w => (
              <div key={w.area} className="wb-row">
                <span className="wb-label">{w.area}</span>
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width: `${w.severity}%`, background: '#FFBD2E' }}></div>
                </div>
                <span className="wb-val text-warning">{w.severity}%</span>
              </div>
            ))}
          </div>
          <div className="ai-tip mt-3">
            <BrainCircuit size={14} className="text-purple" />
            <p>Focus final 30 mins on System Design keywords and STAR closing statements.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="action-panel col-span-2">
          <div className="action-buttons-grid">
            <button className="action-btn primary-action glass-panel">
              <div className="action-icon"><Play size={24} /></div>
              <h4>Start Full Mock Interview</h4>
              <p>1 Tech + 1 HR + Coding Round</p>
            </button>
            <button className="action-btn secondary-action glass-panel">
              <div className="action-icon"><Code2 size={24} /></div>
              <h4>Last Coding Sprint</h4>
              <p>2 medium DSA problems</p>
            </button>
            <button className="action-btn panic-action glass-panel" onClick={() => { setStage('entry'); }}>
              <div className="action-icon"><RefreshCw size={24} /></div>
              <h4>Continue Preparation</h4>
              <p>Reconfigure & keep going</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PanicMode;
