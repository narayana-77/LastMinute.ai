import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, Play, CheckCircle2, AlertCircle, Clock, Save, 
  RotateCcw, Send, MessageSquare, Terminal, ChevronRight
} from 'lucide-react';
import { useApp, ACTIONS } from '../../context/AppContext';
import './CodingInterview.css';

const CodingInterview = () => {
  const navigate = useNavigate();
  const { state, dispatch, toast } = useApp();

  // ── States ────────────────────────────────────────
  const [stage, setStage] = useState('setup'); // setup, live, completed
  const [activeTab, setActiveTab] = useState('problem'); // problem, chat
  const [code, setCode] = useState(`function solve(input) {\n  // Write your code here\n  return true;\n}`);
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
const [focusArea, setFocusArea] = useState('');

const [language, setLanguage] = useState('');

const [difficulty, setDifficulty] = useState('');

const [duration, setDuration] = useState('');
  // ── Timer Logic ───────────────────────────────────
  useEffect(() => {
    let timer;
    if (stage === 'live' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [stage, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ── Handlers ──────────────────────────────────────
  const handleStart = () => setStage('live');

  const handleRunCode = () => {
    setIsRunning(true);
    // Simulate execution delay
    setTimeout(() => {
      setIsRunning(false);
      setTestResults({
        passed: 2,
        total: 3,
        details: [
          { name: "Basic Case", status: "passed", time: "12ms" },
          { name: "Edge Case: Empty Input", status: "passed", time: "8ms" },
          { name: "Performance Case", status: "failed", time: "timeout" },
        ]
      });
    }, 1500);
  };

  const handleSubmit = () => {
    // Record achievement in global state
    dispatch({
      type: ACTIONS.COMPLETE_CODING,
      payload: {
        score: 88,
        difficulty: 'Medium',
        duration: '22:14',
        language: 'JavaScript'
      }
    });
    setStage('completed');
    toast("Interview submitted successfully!", "success");
  };

  // ── Render Helpers ────────────────────────────────

  if (stage === 'setup') {
    return (
      <div className="coding-interview-page setup-view fade-in">
        <div className="page-header">
          <h1 className="page-title">Coding <span className="gradient-text">Round</span></h1>
          <p className="page-subtitle">Demonstrate your problem-solving skills in a live technical environment.</p>
        </div>

        <div className="coding-setup-card glass-panel">

  <div className="setup-top">
    <div className="setup-icon">
      <Code2 size={34} />
    </div>

    <div>
      <h2>Technical Assessment</h2>

      <p>
        Solve real-world coding challenges in a monitored AI interview environment.
      </p>
    </div>
  </div>

  <div className="setup-info-grid">

  {/* Focus Area */}
  <div className="setup-info-card">
    <span>Focus Area</span>

    <select
      className="coding-select"
      value={focusArea}
      onChange={(e) => setFocusArea(e.target.value)}
    >
      <option value="">Choose</option>
      <option>Algorithms & Data Structures</option>
      <option>Frontend Development</option>
      <option>Backend Development</option>
      <option>Full Stack Development</option>
      <option>System Design</option>
      <option>Database Management</option>
      <option>Machine Learning</option>
    </select>
  </div>

  {/* Language */}
  <div className="setup-info-card">
    <span>Language</span>

    <select
  className="coding-select"
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  disabled={focusArea !== 'Algorithms & Data Structures'}
>
  <option value="">Choose</option>
  <option value="">
  {focusArea !== 'Algorithms & Data Structures'
    ? 'Available only for DSA'
    : 'Choose'}
</option>
  <option>JavaScript</option>
  <option>Python</option>
  <option>Java</option>
  <option>C</option>
  <option>C++</option>
  <option>C#</option>
  <option>Go</option>
  <option>Rust</option>
  <option>PHP</option>
</select>
  </div>

  {/* Difficulty */}
  <div className="setup-info-card">
    <span>Difficulty</span>

    <select
      className="coding-select"
      value={difficulty}
      onChange={(e) => setDifficulty(e.target.value)}
    >
      <option value="">Choose</option>
      <option>Easy</option>
      <option>Medium</option>
      <option>Hard</option>
    </select>
  </div>

  {/* Duration */}
  <div className="setup-info-card">
    <span>Duration</span>

    <select
      className="coding-select"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
    >
      <option value="">Choose</option>
      <option>45 Minutes</option>
      <option>1 Hour</option>
      <option>1 Hour 15 Minutes</option>
      <option>1 Hour 30 Minutes</option>
      <option>1 Hour 45 Minutes</option>
      <option>2 Hours</option>
    </select>
  </div>

</div>

  <button
    className="coding-start-btn"
    onClick={handleStart}
  >
    Initialize Environment
    <Play size={18} />
  </button>

</div>
      </div>
    );
  }

  if (stage === 'completed') {
    return (
      <div className="coding-interview-page completion-view fade-in">
        <div className="glass-panel p-10 max-w-2xl mx-auto text-center">
           <div className="flex justify-center mb-6">
              <CheckCircle2 className="text-green" size={64} />
           </div>
           <h1 className="mb-2">Round Complete</h1>
           <p className="text-secondary mb-10">Your solution has been submitted for AI evaluation.</p>
           
           <div className="complexity-grid mb-10">
              <div className="comp-box">
                 <span>Logic Score</span>
                 <h3>92%</h3>
              </div>
              <div className="comp-box">
                 <span>Complexity</span>
                 <h3 className="text-purple">O(n log n)</h3>
              </div>
              <div className="comp-box">
                 <span>Time taken</span>
                 <h3>22:14</h3>
              </div>
           </div>

           <div className="execution-stats glass-panel p-6 mb-10 text-left">
              <h4 className="mb-4">Evaluation Details</h4>
              <div className="exec-stat">
                 <span>Syntax Correctness</span>
                 <strong className="text-green">Passed</strong>
              </div>
              <div className="exec-stat">
                 <span>Edge Case Handling</span>
                 <strong className="text-cyan">8/10</strong>
              </div>
              <div className="exec-stat">
                 <span>Code Readability</span>
                 <strong className="text-purple">Excellent</strong>
              </div>
           </div>

           <div className="flex gap-4">
              <button className="btn btn-primary flex-1" onClick={() => navigate('/dashboard/analytics')}>View Analytics</button>
              <button className="btn btn-outline flex-1" onClick={() => setStage('setup')}>Try Again</button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="coding-interview-page live-view fade-in">
      <div className="workspace-header glass-panel">
         <div className="header-info">
            <h2>String Anagram Solver</h2>
            <span className="domain-badge">Algorithms</span>
            <span className="diff-badge medium">Medium</span>
         </div>
         <div className="header-controls">
            <div className="timer-display">
               <Clock className="text-cyan" size={18} />
               <span>{formatTime(timeLeft)}</span>
            </div>
            <button className="btn btn-primary small" onClick={handleSubmit}>
              Submit Solution <Send size={16} />
            </button>
         </div>
      </div>

      <div className="ide-layout">
        {/* Left Panel: Problem & Chat */}
        <div className="left-panel glass-panel">
          <div className="panel-tabs">
            <button 
              className={`tab-btn ${activeTab === 'problem' ? 'active' : ''}`}
              onClick={() => setActiveTab('problem')}
            >
              <FileText size={18} /> Problem
            </button>
            <button 
              className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare size={18} /> Interviewer
              <span className="notification-dot small"></span>
            </button>
          </div>

          <div className="panel-content">
            {activeTab === 'problem' ? (
              <div className="problem-statement">
                <p>Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>, and <code>false</code> otherwise.</p>
                <p>An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>
                
                <h4>Example 1:</h4>
                <div className="code-block small">
                  Input: s = "anagram", t = "nagaram"<br/>
                  Output: true
                </div>

                <h4>Constraints:</h4>
                <ul>
                  <li><code>1 &le; s.length, t.length &le; 5 * 10^4</code></li>
                  <li><code>s</code> and <code>t</code> consist of lowercase English letters.</li>
                </ul>

                <div className="ai-hint-box mt-10">
                  <BrainCircuit className="text-warning" size={24} />
                  <p>Consider using a hash map or frequency array to track character counts for O(n) performance.</p>
                </div>
              </div>
            ) : (
              <div className="ai-chat-interface">
                <div className="ai-chat-header">
                  <div className="ai-avatar-small">
                    <div className="ai-ring-inner"></div>
                    AI
                  </div>
                  <div className="ai-status-wrap">
                    <p className="font-bold">Technical Interviewer</p>
                    <p className="ai-status">Thinking...</p>
                  </div>
                </div>
                
                <div className="chat-messages p-4">
                  <div className="msg-box ai">
                    <span className="follow-up-tag">Follow-up</span>
                    <p>"Can you explain the space complexity of your current approach?"</p>
                  </div>
                </div>

                <div className="chat-input-area p-2 glass-panel">
                   <input type="text" placeholder="Explain your logic..." className="bg-transparent border-none outline-none flex-1 p-2 text-sm" />
                   <button className="send-btn"><Send size={16} /></button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Editor & Terminal */}
        <div className="right-panel">
          <div className="live-metrics-bar glass-panel mb-4">
             <div className="metric-item">
                <span className="metric-label">Memory Usage</span>
                <span className="metric-val text-cyan">42.8 MB</span>
             </div>
             <div className="metric-item">
                <span className="metric-label">Complexity</span>
                <span className="metric-val text-purple">O(n) Predicted</span>
             </div>
             <div className="metric-item">
                <span className="metric-label">Focus Score</span>
                <span className="metric-val text-pink">98%</span>
             </div>
          </div>

          <div className="editor-container glass-panel">
             <div className="editor-header">
                <span>solution.js</span>
                <div className="flex gap-4">
                   <RotateCcw size={14} className="cursor-pointer hover:text-cyan" />
                   <Save size={14} className="cursor-pointer hover:text-cyan" />
                </div>
             </div>
             <div className="editor-body">
                <div className="line-numbers">
                   {[...Array(15)].map((_, i) => <div key={i}>{i+1}</div>)}
                </div>
                <textarea 
                  className="code-textarea"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck="false"
                />
             </div>
          </div>

          <div className="execution-panel glass-panel mt-4">
             <div className="execution-header">
                <div className="tabs">
                   <span className="active">Test Cases</span>
                   <span>Console Output</span>
                </div>
                <div className="exec-actions">
                   <button 
                    className="btn btn-outline small" 
                    onClick={handleRunCode}
                    disabled={isRunning}
                   >
                     {isRunning ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
                     Run Tests
                   </button>
                </div>
             </div>
             <div className="execution-body">
                {isRunning ? (
                   <div className="flex-center h-full text-muted">Executing solution...</div>
                ) : testResults ? (
                   <div className="test-results">
                      <div className="result-status">
                         <span className="text-green font-bold">{testResults.passed} Passed</span>
                         <span className="text-muted mx-2">/</span>
                         <span className="text-muted">{testResults.total} Total</span>
                      </div>
                      <div className="result-stats mt-4">
                         {testResults.details.map((test, i) => (
                            <div key={i} className="stat-pill">
                               {test.status === 'passed' ? <CheckCircle2 className="text-green" size={14} /> : <X className="text-pink" size={14} />}
                               <span>{test.name}</span>
                               <span className="text-muted text-xs ml-2">{test.time}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                ) : (
                   <div className="flex-center h-full text-muted flex-col">
                      <Terminal size={32} className="mb-2 opacity-20" />
                      <p className="text-sm">Run your code to see results</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingInterview;
