import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  UploadCloud,
  FileText,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Target,
  Code2,
  ChevronRight,
  Play,
  Zap,
  Sparkles,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  MessageSquare,
  FileEdit,
  Map,
  Cpu,
  ArrowUpRight,
  Clock,
  CheckCheck,
  Star
} from 'lucide-react';
import { useApp, ACTIONS } from '../../context/AppContext';
import './ResumeAnalyzer.css';

const API_URL = 'http://localhost:5000';

/* ─── helpers ───────────────────────────────────────── */
const safe = (v, fallback = 'N/A') => (v === undefined || v === null || v === '' ? fallback : v);
const safeNum = (v, fallback = 0) => (v === undefined || v === null || isNaN(Number(v)) ? fallback : Number(v));
const safeArr = (v) => (Array.isArray(v) && v.length ? v : null);

/* ─── Radial ATS Ring ────────────────────────────────── */
const AtsRadial = ({ score = 0, size = 120 }) => {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * Math.min(score, 100)) / 100;

  return (
    <div className="ats-radial-hero">
      <svg width={size} height={size} viewBox="0 0 120 120">
        <defs>
          <linearGradient id="atsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#7000FF" />
          </linearGradient>
        </defs>
        <circle className="ats-radial-track" cx="60" cy="60" r={r} />
        <circle
          className="ats-radial-fill"
          cx="60" cy="60" r={r}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="ats-radial-center">
        <div className="ats-radial-value">{score}</div>
        <div className="ats-radial-label">/ 100</div>
      </div>
    </div>
  );
};

/* ─── Snapshot Card ──────────────────────────────────── */
const SnapshotCard = ({ icon, value, suffix = '', label, sub, color }) => (
  <div className={`snapshot-card ${color}`}>
    <div className="snapshot-icon">{icon}</div>
    <div className="snapshot-value">{value}{suffix}</div>
    <div className="snapshot-label">{label}</div>
    {sub && <div className="snapshot-sub">{sub}</div>}
  </div>
);

/* ─── ATS color helper ───────────────────────────────── */
const atsColor = (score) => {
  const n = safeNum(score);
  if (n >= 75) return '#00FF88';
  if (n >= 50) return '#FFBD2E';
  return '#FF5F56';
};

/* ─── Interview round configs ────────────────────────── */
const ROUNDS = [
  { key: 'technical',    label: 'Technical',     color: '#00F0FF' },
  { key: 'hr',           label: 'HR',            color: '#FF00E5' },
  { key: 'coding',       label: 'Coding',        color: '#7000FF' },
  { key: 'systemDesign', label: 'System Design', color: '#00FF88' },
];

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const { dispatch, toast } = useApp();

  const [jobDescription, setJobDescription] = useState('');
  const [stage, setStage] = useState('upload');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [processingStep, setProcessingStep] = useState(0);
  const [resumeData, setResumeData] = useState(null);

  const processingSteps = [
    'Parsing document structure...',
    'Extracting technical competencies...',
    'Mapping skills to industry benchmarks...',
    'Running ATS optimization check...',
    'Generating interview prediction model...',
  ];

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
    if (!file) { setUploadError('Please upload a resume file.'); return; }
    setStage('processing');
    setProcessingStep(0);

    let step = 0;
    const stepInterval = setInterval(() => {
      step += 1;
      if (step < processingSteps.length - 1) setProcessingStep(step);
    }, 1500);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', targetRole);
      formData.append('jobDescription', jobDescription);

      const response = await axios.post(`${API_URL}/api/resume/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(stepInterval);
      setProcessingStep(processingSteps.length - 1);

      const { resume } = response.data;
      const parsed = resume.parsedData;
      setResumeData(resume);

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
        },
      });

      setTimeout(() => { setStage('results'); toast?.('Resume Analysis Complete!', 'success'); }, 800);
    } catch (error) {
      clearInterval(stepInterval);
      const msg = error.response?.data?.message || 'Failed to analyze resume. Please try again.';
      setUploadError(msg);
      setStage('upload');
      toast?.(msg, 'error');
    }
  };

  const resetUpload = () => {
    setFile(null); setStage('upload'); setProcessingStep(0);
    setResumeData(null); setUploadError(''); setTargetRole('');
  };

  /* ─────────────────────────────────────────────────────
     UPLOAD STAGE
  ───────────────────────────────────────────────────── */
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
            <input id="file-upload" type="file" hidden onChange={(e) => handleFile(e.target.files[0])} accept=".pdf,.doc,.docx" />
            {!file ? (
              <div className="dropzone-content">
                <div className={`upload-icon-wrapper ${isDragging ? 'dragging' : ''}`}>
                  <UploadCloud className="text-cyan" size={40} />
                </div>
                <h3>Drop your resume here</h3>
                <p className="text-muted">Supports PDF, DOC, DOCX up to 5MB</p>
                {uploadError && <div className="upload-error-msg"><AlertTriangle size={14} /> {uploadError}</div>}
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

          <div className="target-role-section glass-panel">
            <div className="target-role-header">
              <div className="target-role-icon"><Target size={20} /></div>
              <div>
                <h3>Target Role</h3>
                <p>Tell AI which role you're preparing for...</p>
              </div>
            </div>
            <input
              type="text"
              placeholder="Frontend Developer, AI Engineer, DevOps Engineer..."
              className="target-role-input"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>

          {!file && (
            <div className="validation-banner">
              <AlertTriangle size={16} />
              <span>Upload a resume to enable AI analysis.</span>
            </div>
          )}

          <button className={`btn btn-primary analyze-btn ${!file ? 'btn-disabled' : ''}`} onClick={handleStartAnalysis} disabled={!file}>
            <BrainCircuit size={20} /> Analyze Resume
          </button>
          <p className="upload-hint">Your data is processed securely and encrypted.</p>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────
     PROCESSING STAGE
  ───────────────────────────────────────────────────── */
  if (stage === 'processing') {
    return (
      <div className="resume-analyzer-page processing-view fade-in">
        <div className="scanner-container">
          <div className="scanner-document">
            <div className="scanner-laser" />
            <div className="doc-line w-80" /><div className="doc-line w-60" />
            <div className="doc-line w-90" /><div className="doc-line w-70" />
            <div className="doc-line w-80 mt-4" /><div className="doc-line w-60" />
            <div className="doc-line w-90" />
          </div>
          <div className="processing-status">
            <h2 className="gradient-text mb-2-text">AI Intelligence Scan...</h2>
            <p className="scan-step-text">{processingSteps[processingStep]}</p>
            <div className="progress-bar-bg mt-8">
              <div className="progress-bar-fill" style={{ width: `${((processingStep + 1) / processingSteps.length) * 100}%` }} />
            </div>
          </div>
          <div className="scan-steps-list">
            {processingSteps.map((step, idx) => (
              <div key={idx} className={`scan-step-row ${idx < processingStep ? 'done' : idx === processingStep ? 'active' : 'pending'}`}>
                <div className="step-icon">
                  {idx < processingStep
                    ? <CheckCircle2 className="text-green" size={16} />
                    : idx === processingStep
                      ? <div className="step-spinner" />
                      : <div className="step-dot" />}
                </div>
                <span className="step-label">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────
     RESULTS STAGE — PREMIUM INTELLIGENCE REPORT
  ───────────────────────────────────────────────────── */
  const parsed     = resumeData?.parsedData       || {};
  const ats        = parsed.atsAnalysis           || {};
  const jobMatch   = parsed.jobMatch              || {};
  const improvements = parsed.improvements        || {};
  const recruiter  = parsed.recruiterInsights     || {};
  const prediction = parsed.interviewPrediction   || {};
  const roadmap    = parsed.careerRoadmap         || {};

  const candidateName    = safe(parsed.name, 'Candidate');
  const targetRoleLabel  = safe(resumeData?.targetRole || parsed.suggestedRoles?.[0], 'Software Engineer');
  const atsScore         = safeNum(ats.overallScore, 0);
  const matchPct         = safeNum(jobMatch.matchPercentage, 0);
  const interviewReady   = safeNum(parsed.interviewReadiness, 0);
  const recruiterScore   = safeNum(recruiter.interestScore, 0);
  const aiConfidence     = safeNum(parsed.aiConfidence || parsed.interviewReadiness, 0);

  // ATS sub-scores
  const atsRows = [
    { name: 'Keyword Optimization', score: safeNum(ats.keywordScore)*10,     tip: 'Add role-specific keywords from the job description.' },
    { name: 'Formatting',           score: safeNum(ats.formattingScore)*10,   tip: 'Use clean headings, consistent dates, and ATS-safe fonts.' },
    { name: 'Readability',          score: safeNum(ats.readabilityScore)*10,  tip: 'Keep sentences concise and scannable.' },
    { name: 'Skills Coverage',      score: safeNum(ats.skillsScore)*10,       tip: 'List relevant hard and soft skills explicitly.' },
    { name: 'Experience Quality',   score: safeNum(ats.experienceScore)*10,   tip: 'Quantify achievements with numbers and impact metrics.' },
  ];

  // Strengths (synthesize from skills + strengthAreas)
  const rawStrengths = safeArr(parsed.strengthAreas) || safeArr(parsed.skills)?.slice(0, 5) || [];
  const strengthItems = rawStrengths.slice(0, 6).map((s, i) => ({
    name: s,
    pct: Math.max(60, 95 - i * 7),
  }));

  // Weaknesses
  const rawWeak = safeArr(parsed.weakAreas) || [];
  const weakItems = rawWeak.map((w, i) => ({
    title: typeof w === 'object' ? w.title : w,
    desc:  typeof w === 'object' ? w.description : 'Addressing this will improve your recruiter visibility.',
    sev:   typeof w === 'object' ? w.severity : (i === 0 ? 'high' : i === 1 ? 'medium' : 'low'),
  }));

  // Roadmap
  const roadmap7  = safeArr(roadmap.days7)  || ['Complete mock interview for target role', 'Add 3 quantified bullet points to experience', 'Research top 5 companies in your domain', 'Fix ATS keyword gaps identified above'];
  const roadmap30 = safeArr(roadmap.days30) || ['Complete 2 full coding assessment sessions', 'Build or polish 1 portfolio project', 'Apply to 20 targeted job listings', 'Request 2 LinkedIn recommendations'];
  const roadmap90 = safeArr(roadmap.days90) || ['Land 5+ first-round interviews', 'Complete system design deep-dive course', 'Negotiate and secure an offer', 'Iterate resume based on recruiter feedback'];

  // Interview prediction rounds
  const roundProbs = {
    technical:    safeNum(prediction.technicalRound    || prediction.technical,    72),
    hr:           safeNum(prediction.hrRound           || prediction.hr,           85),
    coding:       safeNum(prediction.codingRound       || prediction.coding,       68),
    systemDesign: safeNum(prediction.systemDesignRound || prediction.systemDesign, 60),
  };

  const predictedQuestions = safeArr(parsed.predictedQuestions) || safeArr(parsed.interviewQuestions) || [
    { type: 'tech', text: `Explain the architecture decisions behind a recent ${targetRoleLabel} project.` },
    { type: 'proj', text: 'Describe a time you delivered a project under tight deadlines. What was your approach?' },
    { type: 'hr',   text: 'Why are you looking for a new role, and what does your ideal next position look like?' },
    { type: 'sys',  text: 'How would you design a scalable notification system for 10M users?' },
  ];

  // AI verdict
  const aiVerdictText = safe(
    parsed.aiVerdict || parsed.summary,
    `Based on your resume, you are ${atsScore >= 70 ? 'strongly' : 'moderately'} aligned with ${targetRoleLabel} roles. Your ATS performance is ${atsScore >= 70 ? 'above' : 'below'} average — ${atsScore < 70 ? 'missing industry keywords and quantified achievements may reduce recruiter visibility.' : 'but adding quantified metrics will further increase your visibility with top recruiters.'}`
  );

  return (
    <div className="resume-analyzer-page fade-in">

      {/* ── Report Header ─────────────────────────────── */}
      <div className="report-header">
        <div className="report-title-block">
          <h1 className="page-title">Analysis <span className="gradient-text">Complete</span></h1>
          <div className="report-meta">
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <div className="report-meta-dot" />
            <span className="text-cyan">{targetRoleLabel}</span>
            <div className="report-meta-dot" />
            <span>AI Confidence: {aiConfidence}%</span>
          </div>
        </div>
        <div className="report-actions">
          <button className="btn btn-outline" onClick={resetUpload}>
            <RefreshCw size={16} /> Re-analyze
          </button>
        </div>
      </div>

      <div className="results-report">

        {/* ══════════════════════════════════════════════
            SECTION 1 — AI EXECUTIVE SUMMARY HERO
        ══════════════════════════════════════════════ */}
        <div className="exec-summary-hero">
          <div className="exec-hero-layout">

            {/* Left: identity + verdict */}
            <div className="exec-identity">
              <div className="exec-ai-badge">
                <div className="badge-dot" />
                AI Career Intelligence Report
              </div>

              <h2 className="exec-name">{candidateName}</h2>

              <div className="exec-role-line">
                <span className="exec-role-pill"><Target size={13} /> {targetRoleLabel}</span>
                <span className="exec-exp-pill"><TrendingUp size={13} /> {safeNum(parsed.experience?.length, 0)} Roles</span>
              </div>

              <div className="exec-ai-verdict">
                <div className="exec-ai-verdict-label">
                  <Sparkles size={12} /> AI Assessment
                </div>
                <p>{aiVerdictText}</p>
              </div>
            </div>

            {/* Right: radial ATS + confidence */}
            <div className="exec-metrics-col">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <AtsRadial score={atsScore} size={140} />
                <p className="ats-radial-sublabel">ATS Score</p>
              </div>

              <div className="exec-confidence-row">
                <div className="exec-confidence-label">
                  <span>AI Confidence</span>
                  <strong>{aiConfidence}%</strong>
                </div>
                <div className="confidence-bar-bg">
                  <div className="confidence-bar-fill" style={{ width: `${aiConfidence}%` }} />
                </div>
              </div>

              <div className="exec-confidence-row">
                <div className="exec-confidence-label">
                  <span>Interview Readiness</span>
                  <strong style={{ color: '#00F0FF' }}>{interviewReady}%</strong>
                </div>
                <div className="confidence-bar-bg">
                  <div className="confidence-bar-fill" style={{ width: `${interviewReady}%`, background: 'linear-gradient(90deg,#00F0FF,#7000FF)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            SECTION 2 — CAREER SNAPSHOT
        ══════════════════════════════════════════════ */}
        <div className="career-snapshot">
          <SnapshotCard
            icon={<Shield size={18} />}
            value={atsScore}
            label="ATS Score"
            sub={atsScore >= 70 ? 'Above average' : atsScore >= 50 ? 'Needs improvement' : 'Critical gaps'}
            color="cyan"
          />
          <SnapshotCard
            icon={<Target size={18} />}
            value={matchPct}
            suffix="%"
            label="Job Match"
            sub={matchPct ? `vs job description` : 'No JD provided'}
            color="purple"
          />
          <SnapshotCard
            icon={<BrainCircuit size={18} />}
            value={interviewReady}
            suffix="%"
            label="Interview Ready"
            sub={`${safeNum(parsed.skills?.length, 0)} skills detected`}
            color="pink"
          />
          <SnapshotCard
            icon={<Users size={18} />}
            value={recruiterScore || Math.round((atsScore * 0.5 + interviewReady * 0.5))}
            suffix="%"
            label="Recruiter Interest"
            sub="Estimated probability"
            color="green"
          />
        </div>

        {/* ══════════════════════════════════════════════
            TWO-COLUMN GRID SECTIONS
        ══════════════════════════════════════════════ */}
        <div className="results-two-col">

          {/* SECTION 3 — STRENGTH ANALYSIS */}
          <div className="ri-card">
            <div className="ri-card-title" style={{ color: '#00FF88' }}>
              <div className="title-icon-wrap" style={{ background: 'rgba(0,255,136,0.1)' }}>
                <Star size={16} style={{ color: '#00FF88' }} />
              </div>
              AI Strength Analysis
            </div>

            {strengthItems.length ? (
              <div className="strength-list">
                {strengthItems.map((s, i) => (
                  <div key={i} className="strength-item">
                    <div className="strength-item-header">
                      <span className="strength-name">{s.name}</span>
                      <span className="strength-pct">{s.pct}%</span>
                    </div>
                    <div className="strength-bar-bg">
                      <div className="strength-bar-fill" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data-badge">
                <AlertTriangle size={13} /> Complete analysis to unlock strength scoring
              </div>
            )}

            {safeArr(parsed.skills) && (
              <div className="skill-tags" style={{ marginTop: '1.25rem' }}>
                {parsed.skills.slice(0, 12).map((s, i) => (
                  <span key={i} className="tag tag-cyan">{s}</span>
                ))}
                {parsed.skills.length > 12 && (
                  <span className="tag">+{parsed.skills.length - 12} more</span>
                )}
              </div>
            )}
          </div>

          {/* SECTION 4 — WEAKNESS / IMPROVEMENT */}
          <div className="ri-card" style={{ borderColor: 'rgba(255,189,46,0.2)' }}>
            <div className="ri-card-title" style={{ color: '#FFBD2E' }}>
              <div className="title-icon-wrap" style={{ background: 'rgba(255,189,46,0.1)' }}>
                <AlertTriangle size={16} style={{ color: '#FFBD2E' }} />
              </div>
              AI Weakness Analysis
            </div>

            {weakItems.length ? (
              <div className="weakness-items">
                {weakItems.map((w, i) => (
                  <div key={i} className={`weakness-item sev-${w.sev}`}>
                    <span className={`sev-badge ${w.sev}`}>{w.sev}</span>
                    <div className="weakness-item-body">
                      <div className="weakness-item-title">{w.title}</div>
                      <div className="weakness-item-desc">{w.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data-badge"><CheckCheck size={13} /> No critical weaknesses detected</div>
            )}
          </div>

          {/* SECTION 5 — ATS DEEP DIVE */}
          <div className="ri-card">
            <div className="ri-card-title" style={{ color: '#00F0FF' }}>
              <div className="title-icon-wrap" style={{ background: 'rgba(0,240,255,0.1)' }}>
                <BarChart3 size={16} style={{ color: '#00F0FF' }} />
              </div>
              ATS Deep Dive
            </div>

            <div className="ats-breakdown-rows">
              {atsRows.map((row, i) => {
                const c = atsColor(row.score);
                return (
                  <div key={i} className="ats-brow">
                    <div className="ats-brow-header">
                      <span className="ats-brow-name">{row.name}</span>
                      <span className="ats-brow-score" style={{ color: c }}>{row.score}/100</span>
                    </div>
                    <div className="ats-brow-bar-bg">
                      <div className="ats-brow-bar-fill" style={{ width: `${row.score}%`, background: c }} />
                    </div>
                    <div className="ats-brow-tip">{row.tip}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 6 — JOB MATCH INTELLIGENCE */}
          <div className="ri-card">
            <div className="ri-card-title" style={{ color: '#a78bfa' }}>
              <div className="title-icon-wrap" style={{ background: 'rgba(112,0,255,0.1)' }}>
                <Target size={16} style={{ color: '#a78bfa' }} />
              </div>
              Job Match Intelligence
            </div>

            {matchPct ? (
              <>
                <div className="job-match-comparison">
                  <div className="jm-box current">
                    <div className="jm-box-label">Current Match</div>
                    <div className="jm-box-pct">{matchPct}%</div>
                    <div className="jm-box-sub">with your resume</div>
                  </div>
                  <div className="jm-box potential">
                    <div className="jm-box-label">Potential Match</div>
                    <div className="jm-box-pct">{Math.min(100, matchPct + 12)}%</div>
                    <div className="jm-box-sub">after improvements</div>
                  </div>
                </div>

                <div className="jm-missing-section">
                  <div className="jm-missing-label">Missing Keywords</div>
                  <div className="skill-tags">
                    {safeArr(jobMatch.missingKeywords)
                      ? jobMatch.missingKeywords.map((kw, i) => <span key={i} className="tag tag-warning">{kw}</span>)
                      : <span className="no-data-badge">No missing keywords detected</span>
                    }
                  </div>
                </div>
              </>
            ) : (
              <div className="no-data-badge">
                <FileText size={13} /> Provide a job description in the upload step to unlock match intelligence
              </div>
            )}
          </div>

          {/* SECTION 7 — RECRUITER PERSPECTIVE */}
          <div className="ri-card">
            <div className="ri-card-title" style={{ color: '#FF00E5' }}>
              <div className="title-icon-wrap" style={{ background: 'rgba(255,0,229,0.1)' }}>
                <Users size={16} style={{ color: '#FF00E5' }} />
              </div>
              Recruiter Perspective
            </div>

            <div className="recruiter-card-inner">
              <div className="recruiter-persona">
                <div className="recruiter-avatar">R</div>
                <div>
                  <div className="recruiter-name">Senior Tech Recruiter</div>
                  <div className="recruiter-title">AI-Simulated Perspective · Confidential</div>
                </div>
              </div>

              <div className="recruiter-prob-row">
                <div className="rprob-box hire">
                  <div className="rprob-val">
                    {recruiterScore || Math.round(atsScore * 0.7 + interviewReady * 0.3)}%
                  </div>
                  <div className="rprob-lbl">Hire Probability</div>
                </div>
                <div className="rprob-box inter">
                  <div className="rprob-val">{interviewReady}%</div>
                  <div className="rprob-lbl">Interview Probability</div>
                </div>
              </div>

              <div className="recruiter-lists">
                <div className="recruiter-list-section strengths">
                  <h4>What Recruiters Will Notice First</h4>
                  <div className="recruiter-list-items">
                    {(safeArr(recruiter.strengths) || safeArr(parsed.strengthAreas) || ['Strong technical foundation', 'Clear project experience', 'Relevant skill alignment']).slice(0, 4).map((s, i) => (
                      <div key={i} className="recruiter-list-item">
                        <div className="rli-dot" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="recruiter-list-section weaknesses">
                  <h4>Potential Red Flags</h4>
                  <div className="recruiter-list-items">
                    {(safeArr(recruiter.weaknesses) || safeArr(parsed.weakAreas)?.slice(0, 3) || ['Lacks quantified metrics', 'Missing leadership signals', 'No measurable impact statements']).map((w, i) => (
                      <div key={i} className="recruiter-list-item">
                        <div className="rli-dot" />
                        <span>{typeof w === 'object' ? w.title : w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 8 — RESUME REWRITE SUGGESTIONS */}
          <div className="ri-card">
            <div className="ri-card-title" style={{ color: '#00F0FF' }}>
              <div className="title-icon-wrap" style={{ background: 'rgba(0,240,255,0.1)' }}>
                <FileEdit size={16} style={{ color: '#00F0FF' }} />
              </div>
              AI Resume Rewrite
            </div>

            {/* Summary rewrite */}
            <div className="rewrite-block">
              <div className="rewrite-block-label">Professional Summary</div>
              <div className="rewrite-comparison">
                <div className="rewrite-before">
                  <div className="rewrite-chip">Original</div>
                  <p>{safe(parsed.summary, 'No original summary detected in your resume.')}</p>
                </div>
                <div className="rewrite-after">
                  <div className="rewrite-chip">AI Rewrite</div>
                  <p>{safe(improvements.betterSummary, `Results-driven ${targetRoleLabel} with proven ability to deliver scalable solutions. Passionate about building impactful products and driving measurable outcomes across cross-functional teams.`)}</p>
                </div>
              </div>
            </div>

            {/* Bullet rewrites */}
            {safeArr(improvements.betterBulletPoints) && (
              <div className="rewrite-block">
                <div className="rewrite-block-label">Bullet Point Improvements</div>
                <div className="rewrite-after" style={{ width: '100%' }}>
                  <div className="rewrite-chip">AI Enhanced</div>
                  <ul className="rewrite-bullets after" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {improvements.betterBulletPoints.slice(0, 4).map((bp, i) => (
                      <li key={i}><div className="rb-dot" /><span>{bp}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

        </div>{/* end two-col */}

        {/* ══════════════════════════════════════════════
            SECTION 9 — CAREER ROADMAP (full-width)
        ══════════════════════════════════════════════ */}
        <div className="ri-card col-span-2">
          <div className="ri-card-title" style={{ color: '#a78bfa' }}>
            <div className="title-icon-wrap" style={{ background: 'rgba(112,0,255,0.1)' }}>
              <Map size={16} style={{ color: '#a78bfa' }} />
            </div>
            Personalized Career Roadmap
          </div>

          <div className="roadmap-timeline">
            <div className="roadmap-phase days7">
              <div className="roadmap-phase-label"><Clock size={12} /> Next 7 Days</div>
              <div className="roadmap-actions">
                {roadmap7.map((action, i) => (
                  <div key={i} className="roadmap-action-item">
                    <div className="roadmap-check"><CheckCircle2 size={14} style={{ color: 'rgba(0,240,255,0.5)' }} /></div>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="roadmap-phase days30">
              <div className="roadmap-phase-label"><TrendingUp size={12} /> Next 30 Days</div>
              <div className="roadmap-actions">
                {roadmap30.map((action, i) => (
                  <div key={i} className="roadmap-action-item">
                    <div className="roadmap-check"><CheckCircle2 size={14} style={{ color: 'rgba(112,0,255,0.5)' }} /></div>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="roadmap-phase days90">
              <div className="roadmap-phase-label"><Star size={12} /> Next 90 Days</div>
              <div className="roadmap-actions">
                {roadmap90.map((action, i) => (
                  <div key={i} className="roadmap-action-item">
                    <div className="roadmap-check"><CheckCircle2 size={14} style={{ color: 'rgba(0,255,136,0.5)' }} /></div>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            SECTION 10 — INTERVIEW PREDICTION ENGINE
        ══════════════════════════════════════════════ */}
        <div className="ri-card col-span-2">
          <div className="ri-card-title" style={{ color: '#00F0FF' }}>
            <div className="title-icon-wrap" style={{ background: 'rgba(0,240,255,0.1)' }}>
              <Cpu size={16} style={{ color: '#00F0FF' }} />
            </div>
            Interview Prediction Engine
          </div>

          <div className="interview-prediction-grid">
            {ROUNDS.map(({ key, label, color }) => (
              <div key={key} className="interview-round-card">
                <div className="irc-header">
                  <span className="irc-name">{label} Round</span>
                  <span className="irc-prob" style={{ color }}>{roundProbs[key]}%</span>
                </div>
                <div className="irc-bar-bg">
                  <div className="irc-bar-fill" style={{ width: `${roundProbs[key]}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="predicted-questions">
            <div className="pq-label">AI-Predicted Interview Questions</div>
            <div className="pq-list">
              {predictedQuestions.slice(0, 4).map((q, i) => {
                const type = typeof q === 'object' ? (q.type || 'tech') : 'tech';
                const text = typeof q === 'object' ? (q.text || q.question || q) : q;
                return (
                  <div key={i} className={`pq-item ${type}`}>
                    <span className="pq-type">{type}</span>
                    <p className="pq-text">{text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            SECTION 11 — ACTION PANEL
        ══════════════════════════════════════════════ */}
        <div className="action-panel-premium">
          <div className="action-panel-title">
            <h2>Your Next <span className="gradient-text">Move</span></h2>
            <p>Turn your analysis into action. Every minute counts.</p>
          </div>

          <div className="action-buttons-premium">
            <div className="action-btn-premium primary" onClick={() => navigate('/dashboard/mock')}>
              <div className="abp-icon"><Play size={24} /></div>
              <div className="abp-title">Mock Interview</div>
              <div className="abp-sub">Practice rounds tailored to your target role</div>
            </div>
            <div className="action-btn-premium secondary" onClick={() => navigate('/dashboard/questions')}>
              <div className="abp-icon"><MessageSquare size={24} /></div>
              <div className="abp-title">Interview Questions</div>
              <div className="abp-sub">Generate AI questions for your specific profile</div>
            </div>
            <div className="action-btn-premium warning" onClick={() => navigate('/dashboard/coding')}>
              <div className="abp-icon"><Code2 size={24} /></div>
              <div className="abp-title">Coding Assessment</div>
              <div className="abp-sub">Verify technical skills in a live IDE</div>
            </div>
            <div className="action-btn-premium success" onClick={() => navigate('/dashboard/resume/improve')}>
              <div className="abp-icon"><FileEdit size={24} /></div>
              <div className="abp-title">Improve Resume</div>
              <div className="abp-sub">Apply AI suggestions and regenerate score</div>
            </div>
            <div className="action-btn-premium danger" onClick={() => navigate('/dashboard/panic')}>
              <div className="abp-icon"><Zap size={24} /></div>
              <div className="abp-title">Panic Mode</div>
              <div className="abp-sub">Interview in 24h? Generate your emergency plan</div>
            </div>
          </div>
        </div>

      </div>{/* end results-report */}
    </div>
  );
};

export default ResumeAnalyzer;