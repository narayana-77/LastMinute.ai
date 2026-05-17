import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  UploadCloud, FileText,
  BrainCircuit, CheckCircle2, AlertTriangle, RefreshCw,
  Target, Code2, Play, Zap, ChevronRight
} from 'lucide-react';
import { useApp, ACTIONS } from '../../context/AppContext';
import './ResumeAnalyzer.css';

const API_URL = 'http://localhost:5000';

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const { state, dispatch, toast } = useApp();

  const [stage, setStage] = useState('upload'); // upload | processing | results
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [processingStep, setProcessingStep] = useState(0);
  const [resumeData, setResumeData] = useState(null);

  const processingSteps = [
    "Parsing document structure...",
    "Extracting technical competencies...",
    "Mapping skills to industry benchmarks...",
    "Running ATS optimization check...",
    "Generating interview prediction model..."
  ];

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setUploadError('Invalid file type. Please upload PDF or DOCX.');
      return;
    }
    setFile(selectedFile);
    setUploadError('');
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleStartAnalysis = async () => {
    if (!file) {
      setUploadError('Please upload a resume file.');
      return;
    }

    setStage('processing');
    setProcessingStep(0);

    // Animate processing steps while API runs
    let step = 0;
    const stepInterval = setInterval(() => {
      step += 1;
      if (step < processingSteps.length - 1) {
        setProcessingStep(step);
      }
    }, 1500);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', targetRole);

      const response = await axios.post(`${API_URL}/api/resume/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(stepInterval);
      setProcessingStep(processingSteps.length - 1);

      const { resume } = response.data;
      const parsed = resume.parsedData;

      setResumeData(resume);

      // Save to global state
      dispatch({
        type: ACTIONS.SET_RESUME_ANALYZED,
        payload: {
          file: resume.fileName,
          role: resume.targetRole || parsed.suggestedRoles?.[0] || 'Software Engineer',
          experience: parsed.experience?.length > 0 ? `${parsed.experience.length} roles` : 'N/A',
          atsScore: parsed.interviewReadiness || 75,
          skills: parsed.skills || [],
          weakAreas: parsed.weakAreas || [],
          aiConfidence: parsed.interviewReadiness || 75,
          resumeId: resume.id,
        }
      });

      setTimeout(() => {
        setStage('results');
        toast?.("Resume Analysis Complete!", "success");
      }, 800);

    } catch (error) {
      clearInterval(stepInterval);
      console.error('Resume upload error:', error);
      const msg = error.response?.data?.message || 'Failed to analyze resume. Please try again.';
      setUploadError(msg);
      setStage('upload');
      toast?.(msg, "error");
    }
  };

  const resetUpload = () => {
    setFile(null);
    setStage('upload');
    setProcessingStep(0);
    setResumeData(null);
    setUploadError('');
    setTargetRole('');
  };

  // ── Upload Stage ──────────────────────────────────
  if (stage === 'upload') {
    return (
      <div className="resume-analyzer-page fade-in">
        <div className="page-header">
          <h1 className="page-title">Resume <span className="gradient-text">Analyzer</span></h1>
          <p className="page-subtitle">Upload your resume and let AI personalize your interview prep.</p>
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
                <p className="text-muted">Supports PDF, DOC, DOCX up to 5MB</p>
                {uploadError && (
                  <div className="upload-error-msg">
                    <AlertTriangle size={14} /> {uploadError}
                  </div>
                )}
              </div>
            ) : (
              <div className="file-selected-content">
                <div className="file-icon-wrap">
                  <FileText className="text-cyan" size={48} />
                  <span className="file-type-badge">{file.name.split('.').pop().toUpperCase()}</span>
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

          {/* Target Role Input */}
          <div className="glass-panel p-2 flex align-center mt-4" style={{ borderRadius: '12px' }}>
            <Target className="mx-3 text-muted" size={18} />
            <input
              type="text"
              placeholder="Target Role (e.g. Frontend Developer, Data Scientist)"
              className="bg-transparent border-none text-white outline-none flex-1 p-2"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
            />
          </div>

          {!file && (
            <div className="validation-banner">
              <AlertTriangle size={16} />
              <span>Upload a resume to enable AI analysis.</span>
            </div>
          )}

          <button
            className={`btn btn-primary analyze-btn ${!file ? 'btn-disabled' : ''}`}
            onClick={handleStartAnalysis}
            disabled={!file}
          >
            <BrainCircuit size={20} /> Analyze Resume
          </button>

          <p className="upload-hint">Your data is processed securely and encrypted.</p>
        </div>
      </div>
    );
  }

  // ── Processing Stage ──────────────────────────────
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
            <h2 className="gradient-text mb-2">AI Intelligence Scan...</h2>
            <p className="scan-step-text">{processingSteps[processingStep]}</p>
            <div className="progress-bar-bg mt-8">
              <div
                className="progress-bar-fill"
                style={{ width: `${((processingStep + 1) / processingSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="scan-steps-list">
            {processingSteps.map((step, idx) => (
              <div key={idx} className={`scan-step-row ${idx < processingStep ? 'done' : idx === processingStep ? 'active' : 'pending'}`}>
                <div className="step-icon">
                  {idx < processingStep
                    ? <CheckCircle2 className="text-green" size={16} />
                    : idx === processingStep
                      ? <div className="step-spinner"></div>
                      : <div className="step-dot"></div>
                  }
                </div>
                <span className="step-label">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Results Stage ─────────────────────────────────
  const parsed = resumeData?.parsedData || {};

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
        {/* Profile Summary */}
        <div className="result-card glass-panel col-span-2">
          <div className="flex-row">
            <div className="profile-summary">
              <h2 className="candidate-name">{parsed.name || 'Candidate'}</h2>
              <div className="badges">
                <span className="role-badge">{resumeData?.targetRole || parsed.suggestedRoles?.[0] || 'Software Engineer'}</span>
                <span className="exp-badge">{parsed.experience?.length || 0} Roles</span>
              </div>
              <p className="text-secondary mt-3" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                {parsed.summary || 'AI-generated summary not available.'}
              </p>
              <div className="summary-stats mt-4">
                <div className="summary-stat">
                  <span className="stat-num text-cyan">{parsed.interviewReadiness || 75}%</span>
                  <span className="stat-label">Interview Ready</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-num text-purple">{parsed.skills?.length || 0}</span>
                  <span className="stat-label">Skills Found</span>
                </div>
              </div>
            </div>
            <div className="ats-meter-section">
              <div className="circular-progress large">
                <span>{parsed.interviewReadiness || 75}</span>
              </div>
              <p className="ats-label">Readiness Score</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="result-card glass-panel">
          <h3 className="card-title"><Target className="text-cyan" size={20} /> Key Skills Detected</h3>
          <div className="skill-tags">
            {(parsed.skills || []).map(skill => (
              <span key={skill} className="tag">{skill}</span>
            ))}
            {(!parsed.skills || parsed.skills.length === 0) && (
              <p className="text-muted">No skills detected.</p>
            )}
          </div>
        </div>

        {/* Weak Areas */}
        <div className="result-card glass-panel border-warning">
          <h3 className="card-title"><AlertTriangle className="text-warning" size={20} /> Improvement Areas</h3>
          <ul className="weakness-list">
            {(parsed.weakAreas || []).map((area, i) => (
              <li key={i}><strong>{area}</strong></li>
            ))}
            {(!parsed.weakAreas || parsed.weakAreas.length === 0) && (
              <p className="text-muted">No weak areas identified.</p>
            )}
          </ul>
        </div>

        {/* Suggested Roles */}
        <div className="result-card glass-panel">
          <h3 className="card-title"><Code2 className="text-purple" size={20} /> Suggested Roles</h3>
          <div className="questions-preview">
            {(parsed.suggestedRoles || []).map((role, i) => (
              <div key={i} className="q-card">
                <span className="q-tag tech">Role</span>
                <p>{role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strength Areas */}
        <div className="result-card glass-panel">
          <h3 className="card-title"><BrainCircuit className="text-pink" size={20} /> Strength Areas</h3>
          <div className="skill-tags">
            {(parsed.strengthAreas || []).map((s, i) => (
              <span key={i} className="tag tag-green">{s}</span>
            ))}
          </div>
          <button className="btn btn-outline w-full mt-4" onClick={() => navigate('/dashboard/mock')}>
            Start Mock Interview <ChevronRight size={16} />
          </button>
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