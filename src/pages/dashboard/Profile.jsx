import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft, Edit3, Save, X, Camera, Mail, Phone, Globe,
  MapPin, Calendar, Code2, FileText,
  Video, BrainCircuit, TrendingUp, Star, Zap, Shield,
  CheckCircle2, AlertCircle, Lightbulb, Target, Clock,
  Award, ChevronRight, Lock, Bell, Trash2, LogOut, Eye, EyeOff
} from 'lucide-react';
import './Profile.css';

/* ── Stat card ── */
const StatCard = ({ icon: Icon, label, value, accent, delay }) => (
  <div className="pp-stat" style={{ animationDelay: `${delay}ms` }}>
    <div className={`pp-stat__icon pp-stat__icon--${accent}`}><Icon size={18} /></div>
    <div>
      <p className="pp-stat__val">{value ?? '--'}</p>
      <p className="pp-stat__lbl">{label}</p>
    </div>
  </div>
);

/* ── Section wrapper ── */
const Section = ({ title, icon: Icon, children, delay = 0 }) => (
  <div className="pp-section" style={{ animationDelay: `${delay}ms` }}>
    <div className="pp-section__hdr">
      {Icon && <Icon size={16} style={{ color: '#00f0ff' }} />}
      <h2 className="pp-section__title">{title}</h2>
    </div>
    {children}
  </div>
);

/* ── Activity item ── */
const ActivityItem = ({ icon: Icon, title, desc, time, accent }) => (
  <div className="pp-activity">
    <div className={`pp-activity__icon pp-activity__icon--${accent}`}><Icon size={14} /></div>
    <div className="pp-activity__body">
      <p className="pp-activity__title">{title}</p>
      <p className="pp-activity__desc">{desc}</p>
    </div>
    <span className="pp-activity__time">{time}</span>
  </div>
);

/* ── Insight card ── */
const InsightCard = ({ type, text }) => {
  const map = {
    strength:   { icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34,197,94,.08)',   border: 'rgba(34,197,94,.2)',  label: 'Strength'    },
    gap:        { icon: AlertCircle,  color: '#f97316', bg: 'rgba(249,115,22,.08)',  border: 'rgba(249,115,22,.2)', label: 'Gap'         },
    suggestion: { icon: Lightbulb,   color: '#00f0ff', bg: 'rgba(0,240,255,.07)',   border: 'rgba(0,240,255,.18)', label: 'Suggestion'  },
    roadmap:    { icon: Target,       color: '#a855f7', bg: 'rgba(168,85,247,.08)',  border: 'rgba(168,85,247,.2)', label: 'Roadmap'     },
  };
  const m = map[type] ?? map.suggestion;
  const Icon = m.icon;
  return (
    <div className="pp-insight" style={{ background: m.bg, borderColor: m.border }}>
      <Icon size={14} style={{ color: m.color, flexShrink: 0, marginTop: 2 }} />
      <div>
        <span className="pp-insight__label" style={{ color: m.color }}>{m.label}</span>
        <p className="pp-insight__text">{text}</p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Main Profile Page
═══════════════════════════════════════════════════ */
const Profile = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const fileRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name:      state.userName      || 'Narayana Reddy Yaramala',
    email:     state.userEmail     || 'narayana@example.com',
    phone:     state.phone         || '',
    bio:       state.bio           || '',
    location:  state.location      || '',
    skills:    state.skills        || 'React, Node.js, Python, DSA',
    education: state.education     || 'B.Tech Computer Science',
    experience:state.experience    || '',
    linkedin:  state.linkedin      || '',
    github:    state.github        || '',
    portfolio: state.portfolio     || '',
  });

  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const handleChange = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    dispatch({ type: 'UPDATE_PROFILE', payload: form });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const TABS = [
    { key: 'overview',  label: 'Overview'  },
    { key: 'info',      label: 'Edit Info' },
    { key: 'insights',  label: 'AI Insights'},
    { key: 'activity',  label: 'Activity'  },
    { key: 'security',  label: 'Security'  },
  ];

  const STATS = [
    { icon: FileText,    label: 'Resume Score',     value: state.resumeScore      ?? '--', accent: 'purple', delay: 0   },
    { icon: TrendingUp,  label: 'Readiness',        value: state.overallReadiness  != null ? `${state.overallReadiness}%` : '--', accent: 'cyan', delay: 60  },
    { icon: Code2,       label: 'Coding Score',     value: state.codingScore      ?? '--', accent: 'purple', delay: 120 },
    { icon: Star,        label: 'AI Con-fidence',    value: state.aiConfidence     ?? '--', accent: 'gold',   delay: 180 },
    { icon: Video,       label: 'Mock Sessions',    value: state.totalInterviews  ?? 0,    accent: 'cyan',   delay: 240 },
    { icon: Zap,         label: 'Panic Sessions',   value: state.panicSessions    ?? 0,    accent: 'purple', delay: 300 },
  ];

  const INSIGHTS = [
    { type: 'strength',   text: 'Strong React & frontend stack — highly relevant for SDE-2 roles at product companies.' },
    { type: 'strength',   text: 'Resume shows consistent project ownership with measurable outcomes.' },
    { type: 'gap',        text: 'System Design fundamentals need reinforcement — score below 60% in last session.' },
    { type: 'gap',        text: 'Missing quantified impact metrics in 3 out of 5 resume bullet points.' },
    { type: 'suggestion', text: 'Complete 2 more mock interviews to unlock your personalised AI readiness prediction.' },
    { type: 'suggestion', text: 'Add a DSA streak of at least 5 days — consistency boosts offer rates by 23%.' },
    { type: 'roadmap',    text: 'Week 1–2: Lock DSA patterns. Week 3: System Design. Week 4: Behaviorals + HR.' },
  ];

  const ACTIVITY = [
    { icon: FileText,    title: 'Resume uploaded',           desc: 'ATS score: 82% — 3 improvements suggested', time: '2h ago',     accent: 'cyan'   },
    { icon: Video,       title: 'Mock Interview completed',  desc: 'System Design round — Score: 74/100',        time: 'Yesterday',  accent: 'purple' },
    { icon: Code2,       title: 'Coding challenge solved',   desc: 'LeetCode Medium — Two Sum variant',          time: '2 days ago', accent: 'cyan'   },
    { icon: BrainCircuit,title: 'AI Assistant consulted',   desc: 'STAR method examples — 6 queries',           time: '3 days ago', accent: 'purple' },
    { icon: Zap,         title: 'Panic Mode activated',     desc: '2-hour crash prep — 8 modules completed',    time: '5 days ago', accent: 'gold'   },
  ];

  const completedFields = Object.values(form).filter(v => v && String(v).trim()).length;
  const completionPct   = Math.round((completedFields / Object.keys(form).length) * 100);
  const circumference   = 2 * Math.PI * 28;
  const dashOffset      = circumference - (completionPct / 100) * circumference;

  return (
    <div className={`pp ${mounted ? 'pp--in' : ''}`}>
      <div className="pp__orb pp__orb--1" />
      <div className="pp__orb pp__orb--2" />

      <div className="pp__shell">

        {/* ── Top bar ── */}
        <div className="pp__topbar">
          <button className="pp__back" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={17} />
          </button>
          <div className="pp__topbar-title">
            <h1>My Profile</h1>
            {saved && <span className="pp__saved-toast">✓ Saved</span>}
          </div>
          {activeTab === 'info' && (
            <div className="pp__topbar-actions">
              {editing ? (
                <>
                  <button className="pp__btn pp__btn--ghost" onClick={() => setEditing(false)}><X size={15} /> Cancel</button>
                  <button className="pp__btn pp__btn--primary" onClick={handleSave}><Save size={15} /> Save</button>
                </>
              ) : (
                <button className="pp__btn pp__btn--primary" onClick={() => setEditing(true)}><Edit3 size={15} /> Edit Profile</button>
              )}
            </div>
          )}
        </div>

        {/* ── Hero card ── */}
        <div className="pp__hero">
          {/* Avatar */}
          <div className="pp__avatar-wrap">
            <div className="pp__avatar-ring" />
            <div className="pp__avatar-ring pp__avatar-ring--2" />
            <div className="pp__avatar">
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" className="pp__avatar-img" />
                : <span>{state.userInitials || 'NR'}</span>}
            </div>
            <button className="pp__avatar-edit" onClick={() => fileRef.current?.click()} title="Change photo">
              <Camera size={13} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange} />
          </div>

          {/* Info */}
          <div className="pp__hero-info">
            <h2 className="pp__hero-name">{form.name}</h2>
            <p className="pp__hero-role">{state.predictedRole || 'Profile not analyzed'}</p>
            <div className="pp__hero-meta">
              {form.email    && <span><Mail size={12} />{form.email}</span>}
              {form.location && <span><MapPin size={12} />{form.location}</span>}
              {form.education && <span><Award size={12} />{form.education}</span>}
            </div>
            {form.bio && <p className="pp__hero-bio">{form.bio}</p>}
            {form.skills && (
              <div className="pp__skills">
                {form.skills.split(',').map(s => s.trim()).filter(Boolean).map(skill => (
                  <span key={skill} className="pp__skill-chip">{skill}</span>
                ))}
              </div>
            )}
          </div>

          {/* Completion ring */}
          <div className="pp__completion">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="5" />
              <circle cx="36" cy="36" r="28" fill="none"
                stroke="url(#ring-grad)" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 36 36)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <defs>
                <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#7000ff" />
                  <stop offset="100%" stopColor="#00f0ff" />
                </linearGradient>
              </defs>
              <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">{completionPct}%</text>
            </svg>
            <p className="pp__completion-lbl">Profile<br/>Complete</p>
          </div>
        </div>

        {/* ── Stat strip ── */}
        <div className="pp__stats">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* ── Tabs ── */}
        <div className="pp__tabs">
          {TABS.map(t => (
            <button key={t.key}
              className={`pp__tab ${activeTab === t.key ? 'pp__tab--active' : ''}`}
              onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ TAB: OVERVIEW ══ */}
        {activeTab === 'overview' && (
          <div className="pp__tab-body">
            <div className="pp__overview-grid">
              <Section title="Social Links" icon={Globe} delay={0}>
                <div className="pp__links">
                  {form.linkedin  && <a href={form.linkedin}  target="_blank" rel="noreferrer" className="pp__link pp__link--linkedin"><Globe size={15}/> LinkedIn</a>}
                  {form.github    && <a href={form.github}    target="_blank" rel="noreferrer" className="pp__link pp__link--github"><Code2 size={15}/> GitHub</a>}
                  {form.portfolio && <a href={form.portfolio} target="_blank" rel="noreferrer" className="pp__link pp__link--portfolio"><Globe size={15}/> Portfolio</a>}
                  {!form.linkedin && !form.github && !form.portfolio && (
                    <p className="pp__empty-note">No social links added yet. Go to <button onClick={()=>setActiveTab('info')} className="pp__inline-btn">Edit Info</button> to add them.</p>
                  )}
                </div>
              </Section>

              <Section title="Quick Stats" icon={TrendingUp} delay={80}>
                <div className="pp__quick-stats">
                  <div className="pp__qs"><span className="pp__qs-v" style={{color:'#00f0ff'}}>{state.totalInterviews ?? 0}</span><span className="pp__qs-l">Sessions</span></div>
                  <div className="pp__qs-sep"/>
                  <div className="pp__qs"><span className="pp__qs-v" style={{color:'#a855f7'}}>{completionPct}%</span><span className="pp__qs-l">Profile</span></div>
                  <div className="pp__qs-sep"/>
                  <div className="pp__qs"><span className="pp__qs-v" style={{color:'#fbbf24'}}>★ AI</span><span className="pp__qs-l">Powered</span></div>
                </div>
              </Section>
            </div>

            <Section title="Recent Activity" icon={Clock} delay={160}>
              <div className="pp__activity-list">
                {ACTIVITY.map((a, i) => <ActivityItem key={i} {...a} />)}
              </div>
            </Section>
          </div>
        )}

        {/* ══ TAB: EDIT INFO ══ */}
        {activeTab === 'info' && (
          <div className="pp__tab-body">
            <Section title="Personal Information" icon={Edit3} delay={0}>
              <div className="pp__form">
                {[
                  { key:'name',       label:'Full Name',       type:'text',  icon: null       },
                  { key:'email',      label:'Email Address',   type:'email', icon: Mail        },
                  { key:'phone',      label:'Phone Number',    type:'tel',   icon: Phone       },
                  { key:'location',   label:'Location',        type:'text',  icon: MapPin      },
                ].map(f => (
                  <div key={f.key} className="pp__field">
                    <label className="pp__label">{f.label}</label>
                    <input
                      type={f.type}
                      className={`pp__input ${editing ? '' : 'pp__input--readonly'}`}
                      value={form[f.key]}
                      onChange={e => handleChange(f.key, e.target.value)}
                      readOnly={!editing}
                      placeholder={editing ? `Enter ${f.label.toLowerCase()}` : '—'}
                    />
                  </div>
                ))}

                <div className="pp__field pp__field--full">
                  <label className="pp__label">Bio</label>
                  <textarea
                    className={`pp__input pp__textarea ${editing ? '' : 'pp__input--readonly'}`}
                    value={form.bio}
                    onChange={e => handleChange('bio', e.target.value)}
                    readOnly={!editing}
                    rows={3}
                    placeholder={editing ? 'Write a short bio…' : '—'}
                  />
                </div>

                <div className="pp__field pp__field--full">
                  <label className="pp__label">Skills <span className="pp__label-hint">(comma separated)</span></label>
                  <input
                    type="text"
                    className={`pp__input ${editing ? '' : 'pp__input--readonly'}`}
                    value={form.skills}
                    onChange={e => handleChange('skills', e.target.value)}
                    readOnly={!editing}
                    placeholder={editing ? 'React, Node.js, Python…' : '—'}
                  />
                </div>

                {[
                  { key:'education',  label:'Education'         },
                  { key:'experience', label:'Experience'        },
                ].map(f => (
                  <div key={f.key} className="pp__field pp__field--full">
                    <label className="pp__label">{f.label}</label>
                    <input
                      type="text"
                      className={`pp__input ${editing ? '' : 'pp__input--readonly'}`}
                      value={form[f.key]}
                      onChange={e => handleChange(f.key, e.target.value)}
                      readOnly={!editing}
                      placeholder={editing ? `Enter ${f.label.toLowerCase()}` : '—'}
                    />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Social & Links" icon={Globe} delay={80}>
              <div className="pp__form">
                {[
                  { key:'linkedin',  label:'LinkedIn URL',  icon: Globe,    placeholder:'https://linkedin.com/in/...' },
                  { key:'github',    label:'GitHub URL',    icon: Code2,    placeholder:'https://github.com/...'     },
                  { key:'portfolio', label:'Portfolio URL', icon: Globe,    placeholder:'https://yoursite.com'       },
                ].map(f => {
                  const Icon = f.icon;
                  return (
                    <div key={f.key} className="pp__field pp__field--full">
                      <label className="pp__label"><Icon size={12} style={{marginRight:4,verticalAlign:'middle'}}/>{f.label}</label>
                      <input
                        type="url"
                        className={`pp__input ${editing ? '' : 'pp__input--readonly'}`}
                        value={form[f.key]}
                        onChange={e => handleChange(f.key, e.target.value)}
                        readOnly={!editing}
                        placeholder={editing ? f.placeholder : '—'}
                      />
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>
        )}

        {/* ══ TAB: AI INSIGHTS ══ */}
        {activeTab === 'insights' && (
          <div className="pp__tab-body">
            <Section title="AI-Powered Career Insights" icon={BrainCircuit} delay={0}>
              <p className="pp__insights-sub">Based on your resume, sessions, and activity across LastMinute.ai</p>
              <div className="pp__insights-list">
                {INSIGHTS.map((ins, i) => <InsightCard key={i} {...ins} />)}
              </div>
            </Section>
          </div>
        )}

        {/* ══ TAB: ACTIVITY ══ */}
        {activeTab === 'activity' && (
          <div className="pp__tab-body">
            <Section title="Activity Timeline" icon={Clock} delay={0}>
              <div className="pp__activity-list pp__activity-list--full">
                {ACTIVITY.map((a, i) => <ActivityItem key={i} {...a} />)}
              </div>
            </Section>
          </div>
        )}

        {/* ══ TAB: SECURITY ══ */}
        {activeTab === 'security' && (
          <div className="pp__tab-body">
            <Section title="Account Security" icon={Shield} delay={0}>
              <div className="pp__security-list">
                <div className="pp__sec-item">
                  <div className="pp__sec-left">
                    <div className="pp__sec-icon"><Lock size={15}/></div>
                    <div><p className="pp__sec-title">Change Password</p><p className="pp__sec-desc">Update your account password</p></div>
                  </div>
                  <button className="pp__sec-btn">Update <ChevronRight size={13}/></button>
                </div>
                <div className="pp__sec-item">
                  <div className="pp__sec-left">
                    <div className="pp__sec-icon pp__sec-icon--green"><CheckCircle2 size={15}/></div>
                    <div><p className="pp__sec-title">Email Verified</p><p className="pp__sec-desc">{form.email}</p></div>
                  </div>
                  <span className="pp__sec-tag pp__sec-tag--green">Verified</span>
                </div>
                <div className="pp__sec-item">
                  <div className="pp__sec-left">
                    <div className="pp__sec-icon pp__sec-icon--orange"><Shield size={15}/></div>
                    <div><p className="pp__sec-title">Two-Factor Auth</p><p className="pp__sec-desc">Add an extra layer of security</p></div>
                  </div>
                  <button className="pp__sec-btn">Enable <ChevronRight size={13}/></button>
                </div>
                <div className="pp__sec-item">
                  <div className="pp__sec-left">
                    <div className="pp__sec-icon pp__sec-icon--cyan"><Bell size={15}/></div>
                    <div><p className="pp__sec-title">Notifications</p><p className="pp__sec-desc">Manage alert preferences</p></div>
                  </div>
                  <button className="pp__sec-btn" onClick={() => navigate('/dashboard/notifications')}>Manage <ChevronRight size={13}/></button>
                </div>
              </div>
            </Section>

            <Section title="Danger Zone" icon={AlertCircle} delay={100}>
              <div className="pp__danger-zone">
                <div className="pp__danger-item">
                  <div>
                    <p className="pp__danger-title">Delete Account</p>
                    <p className="pp__danger-desc">Permanently delete your account and all data. This cannot be undone.</p>
                  </div>
                  <button className="pp__danger-btn"><Trash2 size={14}/> Delete Account</button>
                </div>
                <div className="pp__danger-item">
                  <div>
                    <p className="pp__danger-title">Sign Out Everywhere</p>
                    <p className="pp__danger-desc">Sign out from all active sessions and devices.</p>
                  </div>
                  <button className="pp__danger-btn pp__danger-btn--logout" onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>
                    <LogOut size={14}/> Sign Out All
                  </button>
                </div>
              </div>
            </Section>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;