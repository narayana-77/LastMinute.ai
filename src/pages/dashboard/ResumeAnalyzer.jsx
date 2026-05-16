import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, FileText, Link as LinkIcon, Code as GithubIcon, Globe,
  BrainCircuit, CheckCircle2, AlertTriangle, X, RefreshCw,
  Target, Code2, Download, Play, Zap, ShieldAlert, File, ChevronRight
} from 'lucide-react';
import { useApp, ACTIONS } from '../../context/AppContext';
import './ResumeAnalyzer.css';

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const { state, dispatch, toast } = useApp();

  // State Management
  const [stage, setStage] = useState('upload'); // upload, processing, results
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // URLs
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Analysis simulation state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);

  const processingSteps = [
    "Parsing document structure...",
    "Extracting technical competencies...",
    "Mapping skills to industry benchmarks...",
    "Running ATS optimization check...",
    "Generating interview prediction model..."
  ];

  // Logic: Upload & Simulation
  useEffect(() => {
    if (stage === 'processing' && uploadProgress < 100) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [stage, uploadProgress]);

  useEffect(() => {
    if (stage === 'processing' && uploadProgress === 100 && processingStep < processingSteps.length) {
      const interval = setInterval(() => {
        setProcessingStep(prev => {
          if (prev >= processingSteps.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              // Finalize analysis in global state
              dispatch({
                type: ACTIONS.SET_RESUME_ANALYZED,
                payload: {
                  file: file?.name || 'LinkedIn Profile',
                  role: 'Senior Frontend Engineer',
                  experience: '4.5 Years',
                  atsScore: 88,
                  skills: ['React', 'TypeScript', 'Next.js', 'Redux', 'System Design', 'Testing', 'AWS'],
                  weakAreas: ['Micro-frontends', 'Advanced SQL'],
                  aiConfidence: 94
                }
              });
              setStage('results');
              toast("Resume Analysis Complete!", "success");
            }, 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [stage, uploadProgress, processingStep, dispatch, file, toast]);

  // Handlers
  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    
    // Simple validation
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      setUploadError('Invalid file type. Please upload PDF or DOC.');
      return;
    }
    
    setFile(selectedFile);
    setUploadError('');
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleStartAnalysis = () => {
    const hasPortfolio = portfolioUrl.trim() || githubUrl.trim() || linkedinUrl.trim();
    if (!file && !hasPortfolio) {
      setUploadError('Please upload a resume or provide a profile link.');
      return;
    }
    setStage('processing');
  };

  const resetUpload = () => {
    setFile(null);
    setStage('upload');
    setUploadProgress(0);
    setProcessingStep(0);
  };

  // ── Render Helpers ────────────────────────────────

  if (stage === 'upload') {
    return (
      <div className="resume-analyzer-page fade-in">
        <div className="page-header">
          <h1 className="page-title">Resume <span className="gradient-text">Analyzer</span></h1>
          <p className="page-subtitle">Personalize your interview prep by uploading your current profile.</p>
        </div>

        <div className="upload-container">
          <div 
            className={`upload-dropzone glass-panel ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''} ${uploadError ? 'has-error' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => !file && document.getElementById('file-upload').click()}
          >
            <input 
              id="file-upload"
              type="file" 
              hidden 
              onChange={(e) => handleFile(e.target.files[0])}
              accept=".pdf,.doc,.docx"
            />

            {!file ? (
              <div className="dropzone-content">
                <div className="upload-icon-wrapper">
                  <UploadCloud className="text-cyan" size={40} />
                </div>
                <h3>Drop your resume here</h3>
                <p className="text-muted">Supports PDF, DOC, DOCX up to 10MB</p>
                {uploadError && <div className="upload-error-msg"><AlertTriangle size={14} /> {uploadError}</div>}
              </div>
            ) : (
              <div className="file-selected-content">
                <div className="file-icon-wrap">
                  <FileText className="text-cyan" size={48} />
                  <span className="file-type-badge">PDF</span>
                </div>
                <div className="file-details">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis</p>
                </div>
                <div className="file-actions">
                  <button className="file-action-btn replace" onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload').click(); }}>Replace</button>
                  <button className="file-action-btn remove" onClick={(e) => { e.stopPropagation(); setFile(null); }}>Remove</button>
                </div>
              </div>
            )}
          </div>

          <div className="upload-divider">OR CONNECT PROFILE</div>

          <div className="url-inputs">
            <div className="glass-panel p-2 flex align-center">
              <GithubIcon className="mx-3 text-muted" size={18} />
              <input 
                type="text" 
                placeholder="GitHub Profile URL" 
                className="bg-transparent border-none text-white outline-none flex-1 p-2"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
              />
            </div>
            <div className="glass-panel p-2 flex align-center">
              <Globe className="mx-3 text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Portfolio or LinkedIn URL" 
                className="bg-transparent border-none text-white outline-none flex-1 p-2"
                value={portfolioUrl}
                onChange={e => setPortfolioUrl(e.target.value)}
              />
            </div>
          </div>

          {!file && !portfolioUrl && !githubUrl && (
             <div className="validation-banner">
                <AlertTriangle size={16} />
                <span>Upload a resume or provide a link to enable AI analysis.</span>
             </div>
          )}

          <button 
            className={`btn btn-primary analyze-btn ${(!file && !portfolioUrl && !githubUrl) ? 'btn-disabled' : ''}`}
            onClick={handleStartAnalysis}
            disabled={!file && !portfolioUrl && !githubUrl}
          >
            <BrainCircuit size={20} /> Analyze Resume
          </button>
          
          <p className="upload-hint">Your data is processed securely and encrypted.</p>
        </div>
      </div>
    );
  }

  if (stage === 'processing') {
    return (
      <div className="resume-analyzer-page processing-view fade-in">
        <div className="scanner-container">
          <div className="scanner-document">
            <div className="scanner-laser"></div>
            <div className="doc-line w-80"></div>
            <div className="doc-line w-60"></div>
            <div className="doc-line w-90"></div>
            <div className="doc-line w-70"></div>
            <div className="doc-line w-80 mt-4"></div>
            <div className="doc-line w-60"></div>
            <div className="doc-line w-90"></div>
          </div>

          <div className="processing-status">
             <h2 className="gradient-text mb-2">
               {uploadProgress < 100 ? "Uploading Artifacts..." : "AI Intelligence Scan..."}
             </h2>
             <p className="scan-step-text">
               {uploadProgress < 100 ? `Syncing files... ${uploadProgress}%` : processingSteps[processingStep]}
             </p>
             
             <div className="progress-bar-bg mt-8">
               <div className="progress-bar-fill" style={{ width: `${uploadProgress < 100 ? uploadProgress : ((processingStep + 1) / processingSteps.length) * 100}%` }}></div>
             </div>
          </div>
          
          <div className="scan-steps-list">
             {processingSteps.map((step, idx) => (
               <div key={idx} className={`scan-step-row ${idx < processingStep ? 'done' : idx === processingStep && uploadProgress === 100 ? 'active' : 'pending'}`}>
                  <div className="step-icon">
                    {idx < processingStep ? <CheckCircle2 className="text-green" size={16} /> : idx === processingStep && uploadProgress === 100 ? <div className="step-spinner"></div> : <div className="step-dot"></div>}
                  </div>
                  <span className="step-label">{step}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  // Results Stage
  return (
    <div className="resume-analyzer-page fade-in">
      <div className="page-header d-flex justify-between align-center">
        <div>
          <h1 className="page-title">Analysis <span className="gradient-text">Complete</span></h1>
          <p className="page-subtitle">We've identified your core strengths and personalized your preparation path.</p>
        </div>
        <button className="btn btn-outline" onClick={resetUpload}><RefreshCw size={18} /> Re-analyze</button>
      </div>

      <div className="results-grid">
        <div className="result-card glass-panel col-span-2">
          <div className="flex-row">
            <div className="profile-summary">
              <h2 className="candidate-name">John Doe</h2>
              <div className="badges">
                <span className="role-badge">Senior Frontend Engineer</span>
                <span className="exp-badge">4.5 Years Exp</span>
              </div>
              <div className="summary-stats mt-4">
                 <div className="summary-stat">
                    <span className="stat-num text-cyan">94%</span>
                    <span className="stat-label">AI Confidence</span>
                 </div>
                 <div className="summary-stat">
                    <span className="stat-num text-purple">Top 5%</span>
                    <span className="stat-label">Market Rank</span>
                 </div>
              </div>
            </div>
            <div className="ats-meter-section">
               <div className="circular-progress large">
                  <span>88</span>
               </div>
               <p className="ats-label">ATS Optimization</p>
            </div>
          </div>
        </div>

        <div className="result-card glass-panel">
          <h3 className="card-title"><Target className="text-cyan" size={20} /> Key Skills Detected</h3>
          <div className="skill-tags">
            {['React', 'TypeScript', 'Next.js', 'Redux', 'System Design', 'Testing', 'AWS', 'Node.js', 'CI/CD'].map(skill => (
              <span key={skill} className="tag">{skill}</span>
            ))}
          </div>
        </div>

        <div className="result-card glass-panel border-warning">
          <h3 className="card-title"><AlertTriangle className="text-warning" size={20} /> Improvement Areas</h3>
          <ul className="weakness-list">
             <li>
               <strong>Micro-frontend Architecture</strong>
               <p>Limited mention of complex orchestration patterns for enterprise apps.</p>
             </li>
             <li>
               <strong>Advanced SQL / Database Scaling</strong>
               <p>Backend performance optimization signals are slightly weak.</p>
             </li>
          </ul>
        </div>

        <div className="result-card glass-panel">
          <h3 className="card-title"><Code2 className="text-purple" size={20} /> Interview Predictions</h3>
          <div className="questions-preview">
             <div className="q-card">
                <span className="q-tag tech">Technical</span>
                <p>"How would you optimize a React application that processes large real-time data streams?"</p>
             </div>
             <div className="q-card">
                <span className="q-tag proj">Architecture</span>
                <p>"Describe your strategy for migrating a legacy monolith to a modern Next.js stack."</p>
             </div>
          </div>
        </div>

        <div className="result-card glass-panel">
          <h3 className="card-title"><BrainCircuit className="text-pink" size={20} /> AI Strategy</h3>
          <p className="text-secondary mb-4">Based on your background, we recommend focusing 60% of your time on System Design and 40% on Behavioral Storytelling.</p>
          <button className="btn btn-outline w-full" onClick={() => navigate('/dashboard/mock')}>View Full Study Plan</button>
        </div>

        {/* Action Panel */}
        <div className="action-panel col-span-2">
           <div className="action-buttons-grid">
              <div className="action-btn glass-panel primary-action" onClick={() => navigate('/dashboard/mock')}>
                <div className="action-icon"><Play size={24} /></div>
                <h4>Start Mock Interview</h4>
                <p>Practice specific rounds tailored to your role</p>
              </div>
              <div className="action-btn glass-panel secondary-action" onClick={() => navigate('/dashboard/coding')}>
                <div className="action-icon"><Code2 size={24} /></div>
                <h4>Coding Challenge</h4>
                <p>Verify your technical skills in a live IDE</p>
              </div>
              <div className="action-btn glass-panel panic-action" onClick={() => navigate('/dashboard/panic')}>
                <div className="action-icon"><Zap size={24} /></div>
                <h4>Panic Mode</h4>
                <p>Have an interview soon? Generate a 24h plan</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
