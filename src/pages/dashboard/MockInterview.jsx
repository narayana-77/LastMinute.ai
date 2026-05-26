import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, 
  MessageSquare, BrainCircuit, Play, CheckCircle2, 
  Clock, Shield, Star, AlertTriangle, ChevronRight, RefreshCw
} from 'lucide-react';
import { useApp, ACTIONS } from '../../context/AppContext';
import './MockInterview.css';

const MockInterview = () => {
  const navigate = useNavigate();
  const { state, dispatch, toast } = useApp();

  // ── States ────────────────────────────────────────
  const [stage, setStage] = useState('setup'); // setup, live, results
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [targetRole, setTargetRole] = useState('');
  const [webcamReady, setWebcamReady] = useState(false);
const [micReady, setMicReady] = useState(false);
const [aiReady, setAiReady] = useState(false);
const [focusArea, setFocusArea] = useState('Behavioral');
  const questions = [
    "Tell me about a time you had to deal with a difficult stakeholder. How did you handle it?",
    "What is your approach to ensuring code quality in a fast-paced environment?",
    "Can you describe a technical challenge you solved recently? What was the outcome?",
    "How do you stay updated with the latest trends in Frontend development?"
  ];

  // ── Timer Logic ───────────────────────────────────
  useEffect(() => {
    let timer;
    if (stage === 'live' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [stage, timeLeft]);
useEffect(() => {

  const timer1 = setTimeout(() => {
    setWebcamReady(true);
  }, 1200);

  const timer2 = setTimeout(() => {
    setMicReady(true);
  }, 2200);

  const timer3 = setTimeout(() => {
    setAiReady(true);
  }, 3200);

  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
    clearTimeout(timer3);
  };

}, []);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ── Handlers ──────────────────────────────────────
  const handleStart = () => setStage('live');

  const handleEnd = () => {
    // Record achievement in global state
    dispatch({
      type: ACTIONS.COMPLETE_INTERVIEW,
      payload: {
        score: 84,
        role: state.predictedRole || 'Frontend Engineer',
        duration: '28:14',
        feedback: ["Strong communication", "Excellent technical depth", "Clear project ownership"]
      }
    });
    setStage('results');
    toast("Interview analysis complete!", "success");
  };

  // ── Render Helpers ────────────────────────────────

  if (stage === 'setup') {
    return (
      <div className="mock-interview-page setup-view fade-in">
        <div className="page-header">
          <h1 className="page-title">Mock <span className="gradient-text">Interview</span></h1>
          <p className="page-subtitle">Simulate a high-pressure interview with AI-driven behavioral analysis.</p>
        </div>

        <div className="setup-container">
          <div className="glass-panel setup-form">
            <div className="form-section">
              <div className="section-title"><BrainCircuit size={20} className="text-purple" /> <h3>Interview Parameters</h3></div>
              <div className="input-group">

  <label>
    Target Role
  </label>

  <input
    type="text"
    className="premium-role-input"
    placeholder="Enter target role..."
    value={targetRole}
    onChange={(e) => setTargetRole(e.target.value)}
  />

</div>
              <div className="input-group">

  <label>Focus Areas</label>

  <div className="focus-chips">

  <button
    type="button"
    className={`focus-chip ${
      focusArea === 'Behavioral' ? 'active' : ''
    }`}
    onClick={() => setFocusArea('Behavioral')}
  >
    Behavioral
  </button>

  <button
    type="button"
    className={`focus-chip ${
      focusArea === 'Leadership' ? 'active' : ''
    }`}
    onClick={() => setFocusArea('Leadership')}
  >
    Leadership
  </button>

  <button
    type="button"
    className={`focus-chip ${
      focusArea === 'Communication' ? 'active' : ''
    }`}
    onClick={() => setFocusArea('Communication')}
  >
    Communication
  </button>

</div>

</div>
            </div>

            <div className="form-section">
              <div className="section-title"><Shield size={20} className="text-cyan" /> <h3>System Check</h3></div>
              <div className="toggle-group">

  <div className="toggle-item">
    <span>Webcam Access</span>

    {webcamReady ? (
      <CheckCircle2
        className="text-green status-success"
        size={20}
      />
    ) : (
      <div className="status-loader"></div>
    )}
  </div>

  <div className="toggle-item">
    <span>Microphone Access</span>

    {micReady ? (
      <CheckCircle2
        className="text-green status-success"
        size={20}
      />
    ) : (
      <div className="status-loader"></div>
    )}
  </div>

  <div className="toggle-item">
    <span>AI Readiness</span>

    {aiReady ? (
      <CheckCircle2
        className="text-green status-success"
        size={20}
      />
    ) : (
      <div className="status-loader"></div>
    )}
  </div>

</div>
            </div>

            <button className="btn btn-primary w-full pulse-btn" onClick={handleStart}>
              Initialize AI Interviewer <Play size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'results') {
    return (
      <div className="mock-interview-page results-view fade-in">
        <div className="glass-panel p-10 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="mb-2">Session <span className="gradient-text">Analysis</span></h1>
            <p className="text-secondary">Your behavioral performance has been evaluated by AI.</p>
          </div>

          <div className="scores-container mb-12">
            <div className="score-ring-wrap">
              <div className="score-ring" style={{ background: `conic-gradient(var(--accent-cyan) 84%, rgba(255,255,255,0.05) 0)` }}>
                <div className="score-inner">
                  <h2>84</h2>
                  <span>Score</span>
                </div>
              </div>
            </div>

            <div className="sub-scores">
              <div className="sub-score-item">
                <span className="sub-label">Confidence</span>
                <div className="progress-bg"><div className="progress-fill bg-cyan" style={{ width: '92%' }}></div></div>
                <span className="sub-val">92%</span>
              </div>
              <div className="sub-score-item">
                <span className="sub-label">Clarity</span>
                <div className="progress-bg"><div className="progress-fill bg-purple" style={{ width: '78%' }}></div></div>
                <span className="sub-val">78%</span>
              </div>
              <div className="sub-score-item">
                <span className="sub-label">Empathy</span>
                <div className="progress-bg"><div className="progress-fill bg-pink" style={{ width: '88%' }}></div></div>
                <span className="sub-val">88%</span>
              </div>
            </div>
          </div>

          <div className="feedback-grid">
            <div className="glass-panel p-6 border-cyan">
               <h4 className="flex align-center gap-2 mb-4 text-cyan"><CheckCircle2 size={18} /> Key Strengths</h4>
               <ul className="feedback-list">
                 <li>Excellent articulation of technical problems.</li>
                 <li>Maintains strong eye contact with the interviewer.</li>
                 <li>Provides structured answers using the STAR method.</li>
               </ul>
            </div>
            <div className="glass-panel p-6 border-pink">
               <h4 className="flex align-center gap-2 mb-4 text-pink"><AlertTriangle size={18} /> Weaknesses</h4>
               <ul className="feedback-list">
                 <li>Tendency to over-explain simple concepts.</li>
                 <li>Could improve storytelling for leadership scenarios.</li>
                 <li>Pace was slightly too fast during the second half.</li>
               </ul>
            </div>
          </div>

          <div className="flex gap-4 mt-12">
             <button className="btn btn-primary flex-1" onClick={() => navigate('/dashboard/analytics')}>Deep Analytics <ChevronRight size={18} /></button>
             <button className="btn btn-outline flex-1" onClick={() => setStage('setup')}>Retry Mock</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mock-interview-page live-view fade-in">
      <div className="live-header glass-panel">
         <div className="live-header-info">
            <div className="recording-indicator"><div className="dot red animate-pulse"></div> REC</div>
            <span className="live-title">Senior Frontend Mock Round</span>
         </div>
         <div className="live-timer">{formatTime(timeLeft)}</div>
      </div>

      <div className="live-grid">
         {/* Left Side: Video Panels */}
         <div className="video-section">
            <div className="video-panel ai-panel glass-panel">
               <div className="panel-label">AI Interviewer</div>
               <div className="ai-avatar-container">
                  <div className="ai-ring-outer animate-spin-slow"></div>
                  <div className="ai-ring-inner animate-spin-reverse"></div>
                  <div className="ai-face">AI</div>
               </div>
               <div className="voice-waves">
                  <div className="wave"></div><div className="wave"></div><div className="wave"></div><div className="wave"></div><div className="wave"></div>
               </div>
            </div>
            <div className="video-panel user-panel glass-panel">
               <div className="panel-label">You (Candidate)</div>
               <div className="user-webcam-placeholder">
                  <div className="text-muted opacity-30"><VideoIcon size={64} /></div>
                  <p className="text-muted text-sm">Simulated Camera Feed</p>
               </div>
               <div className={`mic-status ${isMuted ? 'muted' : 'active'}`}>
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
               </div>
            </div>
         </div>

         {/* Right Side: Transcript & Feedback */}
         <div className="transcript-section glass-panel">
            <div className="question-card">
               <div className="q-header">
                  <span className="text-xs text-muted font-bold tracking-widest uppercase">Current Question</span>
                  <span className="q-diff">Difficulty: Medium</span>
               </div>
               <p className="current-q">{questions[currentQuestion]}</p>
            </div>

            <div className="chat-container">
               <div className="chat-msg ai-msg">
                  <strong>Interviewer:</strong>
                  <span>"Tell me about a time you had to deal with a difficult stakeholder. How did you handle it?"</span>
               </div>
               <div className="chat-msg user-msg">
                  <strong>You:</strong>
                  <span>"I recall a situation where..."</span>
               </div>
               <div className="chat-msg ai-msg">
                  <div className="typing-indicator">
                    <span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span>
                  </div>
               </div>
            </div>

            <div className="live-feedback-widgets">
               <div className="fw-item good">
                  <span>Sentiment</span>
                  <strong>Positive</strong>
               </div>
               <div className="fw-item warning">
                  <span>Confidence</span>
                  <strong>Neutral</strong>
               </div>
               <div className="fw-item info">
                  <span>Key Points</span>
                  <strong>STAR Method</strong>
               </div>
            </div>
         </div>
      </div>

      <div className="live-controls glass-panel">
         <div className="control-group">
            <button className={`ctrl-btn ${isMuted ? 'active danger' : ''}`} onClick={() => setIsMuted(!isMuted)}>
               {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button className={`ctrl-btn ${isVideoOff ? 'active' : ''}`} onClick={() => setIsVideoOff(!isVideoOff)}>
               {isVideoOff ? <VideoOff size={20} /> : <VideoIcon size={20} />}
            </button>
            <button className="ctrl-btn warning">
               <MessageSquare size={20} />
            </button>
         </div>
         <div className="control-group">
            <button className="btn btn-outline" onClick={() => setCurrentQuestion(prev => (prev + 1) % 4)}>Next Question <ChevronRight size={16} /></button>
            <button className="btn btn-primary end-call" onClick={handleEnd}><PhoneOff size={20} /> End Session</button>
         </div>
      </div>
    </div>
  );
};

export default MockInterview;
