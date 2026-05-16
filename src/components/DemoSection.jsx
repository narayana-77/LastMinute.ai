import { useState, useEffect, useRef } from 'react';

import {
  Mic,
  Video,
  MonitorUp,
  PhoneOff,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

import Editor from '@monaco-editor/react';

import './DemoSection.css';

const DemoSection = () => {

  const [timer, setTimer] = useState(0);

  const [activeTab, setActiveTab] = useState('feedback');

  const [cameraOn, setCameraOn] = useState(false);

  const [micOn, setMicOn] = useState(false);

  const userName =
    localStorage.getItem("userName") || "Broo";

  const [code, setCode] = useState(`function greet() {
  console.log("Hello ${userName}");
}

greet();`);

  const videoRef = useRef(null);

  const streamRef = useRef(null);

  // TIMER

  useEffect(() => {

    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);

  }, []);

  // FORMAT TIMER

  const formatTime = (seconds) => {

    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');

    const s = (seconds % 60)
      .toString()
      .padStart(2, '0');

    return `${m}:${s}`;
  };

  // CAMERA TOGGLE

  const toggleCamera = async () => {

    try {

      if (!cameraOn) {

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true
          });

        streamRef.current = stream;

        setCameraOn(true);

        setTimeout(() => {

          if (videoRef.current) {

            videoRef.current.srcObject = stream;

            videoRef.current
              .play()
              .catch(() => {});

          }

        }, 100);

      } else {

        streamRef.current?.getTracks().forEach(track => {
          track.stop();
        });

        streamRef.current = null;

        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }

        setCameraOn(false);

      }

    } catch (err) {

      console.log("Camera error:", err);

    }

  };

  // MIC TOGGLE

  const toggleMic = async () => {

    try {

      if (!micOn) {

        await navigator.mediaDevices.getUserMedia({
          audio: true
        });

        setMicOn(true);

      } else {

        setMicOn(false);

      }

    } catch (err) {

      console.log("Mic error:", err);

    }

  };

  return (

    <section
      id="demo"
      className="demo-section section"
    >

      <div className="container">

        {/* HEADER */}

        <div className="section-header text-center">

          <h2 className="section-title">
            Experience The{" "}
            <span className="gradient-text">
              Future
            </span>
          </h2>

          <p className="section-subtitle">
            A sneak peek into our AI-powered
            interview environment.
          </p>

        </div>

        {/* MAIN WINDOW */}

        <div className="demo-app-window glass-panel">

          {/* TOP BAR */}

          <div className="demo-header">

            <div className="demo-window-controls">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>

            <div className="demo-title">
              Mock Interview:
              Frontend Engineering
            </div>

            <div className="demo-timer">
              {formatTime(timer)}
            </div>

          </div>

          {/* BODY */}

          <div className="demo-body">

            {/* VIDEO GRID */}

            <div className="demo-video-grid">

              {/* AI INTERVIEWER */}

              <div className="video-cell ai-agent">

                <div className="ai-avatar-wrapper">

                  <div className="ai-pulse"></div>

                  <div className="ai-avatar">
                    AI
                  </div>

                </div>

                <div className="cell-label">
                  AI Interviewer
                </div>

                <div className="ai-speaking-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>

              {/* USER CAMERA */}

              <div className="video-cell candidate">

                {cameraOn ? (

                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="user-video"
                  />

                ) : (

                  <div className="candidate-placeholder">

                    <Video
                      size={48}
                      color="rgba(255,255,255,0.2)"
                    />

                  </div>

                )}

                <div className="cell-label">
                  You
                </div>

              </div>

            </div>

            {/* SIDEBAR */}

            <div className="demo-sidebar glass-panel">

              {/* TABS */}

              <div className="sidebar-tabs">

                <div
                  className={`tab ${
                    activeTab === 'feedback'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setActiveTab('feedback')
                  }
                >
                  Feedback
                </div>

                <div
                  className={`tab ${
                    activeTab === 'chat'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setActiveTab('chat')
                  }
                >
                  Chat
                </div>

                <div
                  className={`tab ${
                    activeTab === 'code'
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setActiveTab('code')
                  }
                >
                  Code
                </div>

              </div>

              {/* FEEDBACK TAB */}

              {activeTab === 'feedback' && (

                <div className="feedback-content">

                  <div className="confidence-meter">

                    <div className="meter-header">

                      <span>
                        Confidence Score
                      </span>

                      <span className="meter-value">
                        85%
                      </span>

                    </div>

                    <div className="meter-bar-bg">

                      <div
                        className="meter-bar-fill"
                        style={{
                          width: '85%'
                        }}
                      ></div>

                    </div>

                  </div>

                  <div className="live-tips">

                    <h4>Live Tips</h4>

                    <ul>

                      <li className="tip good">

                        <CheckCircle size={14} />

                        Good eye contact

                      </li>

                      <li className="tip warning">

                        <MessageSquare size={14} />

                        Elaborate on React Hooks

                      </li>

                    </ul>

                  </div>

                </div>

              )}

              {/* CHAT TAB */}

              {activeTab === 'chat' && (

                <div className="feedback-content">

                  <div className="ai-transcript">

                    <div className="chat ai-chat">

                      <strong>AI:</strong>{" "}

                      Can you explain how
                      the virtual DOM works
                      in React and why it
                      improves performance?

                    </div>

                    <div className="chat user-chat">

                      <strong>You:</strong>{" "}

                      The virtual DOM is a
                      lightweight copy of
                      the actual DOM...

                    </div>

                  </div>

                </div>

              )}

              {/* CODE TAB */}

              {activeTab === 'code' && (

                <div className="feedback-content">

                  <div className="code-editor-wrapper">

                    <Editor
                      height="320px"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={code}
                      onChange={(value) =>
                        setCode(value)
                      }

                      options={{
                        minimap: {
                          enabled: false
                        },

                        fontSize: 14,

                        scrollBeyondLastLine: false,

                        automaticLayout: true,

                        padding: {
                          top: 12
                        }
                      }}
                    />

                  </div>

                </div>

              )}

            </div>

          </div>

          {/* FOOTER */}

          <div className="demo-footer">

            <div className="controls-center">

              {/* MIC */}

              <button
                className={`control-btn ${
                  micOn ? 'active' : ''
                }`}
                onClick={toggleMic}
              >
                <Mic size={20} />
              </button>

              {/* CAMERA */}

              <button
                className={`control-btn ${
                  cameraOn ? 'active' : ''
                }`}
                onClick={toggleCamera}
              >
                <Video size={20} />
              </button>

              {/* SCREEN SHARE */}

              <button className="control-btn">
                <MonitorUp size={20} />
              </button>

              {/* END CALL */}

              <button className="control-btn end-call">
                <PhoneOff size={20} />
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>

  );
};

export default DemoSection;