import { useState, useEffect } from 'react';
import { Mic, Video, MonitorUp, PhoneOff, MessageSquare } from 'lucide-react';
import './DemoSection.css';

const DemoSection = () => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <section id="demo" className="demo-section section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">
            Experience The <span className="gradient-text">Future</span>
          </h2>
          <p className="section-subtitle">
            A sneak peek into our AI-powered interview environment.
          </p>
        </div>
        
        <div className="demo-app-window glass-panel">
          <div className="demo-header">
            <div className="demo-window-controls">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="demo-title">Mock Interview: Frontend Engineering</div>
            <div className="demo-timer">{formatTime(timer)}</div>
          </div>
          
          <div className="demo-body">
            <div className="demo-video-grid">
              <div className="video-cell ai-agent">
                <div className="ai-avatar-wrapper">
                  <div className="ai-pulse"></div>
                  <div className="ai-avatar">AI</div>
                </div>
                <div className="cell-label">AI Interviewer</div>
                <div className="ai-speaking-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
              
              <div className="video-cell candidate">
                <div className="candidate-placeholder">
                  <Video size={48} color="rgba(255,255,255,0.2)" />
                </div>
                <div className="cell-label">You</div>
              </div>
            </div>
            
            <div className="demo-sidebar glass-panel">
              <div className="sidebar-tabs">
                <div className="tab active">Feedback</div>
                <div className="tab">Chat</div>
                <div className="tab">Code</div>
              </div>
              
              <div className="feedback-content">
                <div className="confidence-meter">
                  <div className="meter-header">
                    <span>Confidence Score</span>
                    <span className="meter-value">85%</span>
                  </div>
                  <div className="meter-bar-bg">
                    <div className="meter-bar-fill" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div className="live-tips">
                  <h4>Live Tips</h4>
                  <ul>
                    <li className="tip good"><CheckCircle size={14} /> Good eye contact</li>
                    <li className="tip warning"><MessageSquare size={14} /> Elaborate on React Hooks</li>
                  </ul>
                </div>
                
                <div className="ai-transcript">
                  <div className="chat ai-chat">
                    <strong>AI:</strong> Can you explain how the virtual DOM works in React and why it improves performance?
                  </div>
                  <div className="chat user-chat">
                    <strong>You:</strong> The virtual DOM is a lightweight copy of the actual DOM...
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="demo-footer">
            <div className="controls-center">
              <button className="control-btn active"><Mic size={20} /></button>
              <button className="control-btn active"><Video size={20} /></button>
              <button className="control-btn"><MonitorUp size={20} /></button>
              <button className="control-btn end-call"><PhoneOff size={20} /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Fixing missing icon import
import { CheckCircle } from 'lucide-react';

export default DemoSection;
