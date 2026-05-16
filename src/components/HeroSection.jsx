import { Play, UploadCloud, Cpu, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section section">
      <div className="bg-glow"></div>
      <div className="bg-glow-right"></div>
      
      <div className="container hero-container">
        <div className="hero-content">
          <div className="badge animate-float">
            <Cpu size={16} className="badge-icon" />
            <span>AI-Powered Interview Engine</span>
          </div>
          
          <h1 className="hero-title">
            Ace Your Interview <br />
            <span className="gradient-text">Before It Starts</span>
          </h1>
          
          <p className="hero-subtitle">
            Upload your resume and let our futuristic AI engine generate personalized mock interviews, coding challenges, and HR rounds in seconds. Prepare for the future of hiring.
          </p>
          
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
              <Play size={20} />
              Start Mock Interview
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/signup')}>
              <UploadCloud size={20} />
              Upload Resume
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">10k+</span>
              <span className="stat-label">Interviews</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="avatars">
                <div className="avatar"></div>
                <div className="avatar"></div>
                <div className="avatar"></div>
              </div>
              <span className="stat-label">Join 50k+ users</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="ai-core-container">
            {/* The Portal / Rounded Square Container */}
            <div className="core-portal glass-panel">
              <div className="portal-glow"></div>
              <div className="portal-inner"></div>
            </div>

            {/* The Morphing AI Brain/Core */}
            <div className="ai-brain-core">
              <div className="brain-blob blob-1"></div>
              <div className="brain-blob blob-2"></div>
              <div className="brain-blob blob-3"></div>
              <div className="brain-glow"></div>
            </div>

            {/* Floating Info Cards */}
            <div className="floating-card card-skill glass-panel animate-float-delayed">
              <div className="card-header">
                <div className="status-dot pulsing"></div>
                <span>Analyzing Skills...</span>
              </div>
              <div className="skill-bars">
                <div className="skill-bar" style={{ width: '85%' }}></div>
                <div className="skill-bar" style={{ width: '60%' }}></div>
                <div className="skill-bar" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div className="floating-card card-status glass-panel animate-float">
              <div className="status-icon-wrap">
                <BrainCircuit size={20} className="text-purple" />
              </div>
              <div className="status-info">
                <h4>System Design</h4>
                <p>Generating Scenario...</p>
              </div>
            </div>

            {/* Background Ambient Glows */}
            <div className="ambient-glow purple-glow"></div>
            <div className="ambient-glow cyan-glow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
