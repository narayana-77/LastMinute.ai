import { createContext, useContext, useReducer, useCallback } from 'react';

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {

  // Auth
  isAuthenticated: !!localStorage.getItem("token"),

  userName: localStorage.getItem("userName") || '',

  userEmail: localStorage.getItem("userEmail") || '',

  userInitials: localStorage.getItem("userName")
    ? localStorage
        .getItem("userName")
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
    : '',

  phone: localStorage.getItem("userPhone") || '',
  bio: localStorage.getItem("userBio") || '',
  location: localStorage.getItem("userLocation") || '',
  skills: localStorage.getItem("userSkills") || 'React, Node.js, Python, DSA',
  education: localStorage.getItem("userEducation") || 'B.Tech Computer Science',
  experience: localStorage.getItem("userExperience") || '',
  linkedin: localStorage.getItem("userLinkedin") || '',
  github: localStorage.getItem("userGithub") || '',
  portfolio: localStorage.getItem("userPortfolio") || '',

  // Resume / Profile data
  resumeFile: null,
  resumeSource: null,
  resumeAnalyzed: false,
  predictedRole: null,
  experienceLevel: null,
  atsScore: null,
  detectedSkills: [],
  detectedLanguage: null,
  weakAreas: [],
  aiConfidence: null,

  // Interview History
  interviewHistory: [],

  // Session scores
  mockScore: null,
  codingScore: null,
  hrScore: null,
  overallReadiness: null,

  // Analytics aggregate
  totalInterviews: 0,
  averageScore: null,

  // Toast queue
  toasts: [],
};

// ── Action Types ──────────────────────────────────────────────────────────────
export const ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_RESUME_ANALYZED: 'SET_RESUME_ANALYZED',
  COMPLETE_INTERVIEW: 'COMPLETE_INTERVIEW',
  COMPLETE_CODING: 'COMPLETE_CODING',
  COMPLETE_HR: 'COMPLETE_HR',
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  RESET_RESUME: 'RESET_RESUME',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
};

// ── Reducer ───────────────────────────────────────────────────────────────────
const appReducer = (state, action) => {

  switch (action.type) {

    // ── LOGIN ───────────────────────────────────────────────────────────────
    case ACTIONS.LOGIN: {

      const { name, email } = action.payload;

      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);

      const initials = name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      return {
        ...state,
        isAuthenticated: true,
        userName: name,
        userEmail: email,
        userInitials: initials,
      };
    }

    // ── LOGOUT ──────────────────────────────────────────────────────────────
    case ACTIONS.LOGOUT: {

      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhone");
      localStorage.removeItem("userBio");
      localStorage.removeItem("userLocation");
      localStorage.removeItem("userSkills");
      localStorage.removeItem("userEducation");
      localStorage.removeItem("userExperience");
      localStorage.removeItem("userLinkedin");
      localStorage.removeItem("userGithub");
      localStorage.removeItem("userPortfolio");

      return {
        ...initialState,
        toasts: state.toasts,
      };
    }

    case ACTIONS.UPDATE_PROFILE: {
      const { name, email, phone, bio, location, skills, education, experience, linkedin, github, portfolio } = action.payload;

      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPhone", phone || '');
      localStorage.setItem("userBio", bio || '');
      localStorage.setItem("userLocation", location || '');
      localStorage.setItem("userSkills", skills || '');
      localStorage.setItem("userEducation", education || '');
      localStorage.setItem("userExperience", experience || '');
      localStorage.setItem("userLinkedin", linkedin || '');
      localStorage.setItem("userGithub", github || '');
      localStorage.setItem("userPortfolio", portfolio || '');

      const initials = name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      return {
        ...state,
        userName: name,
        userEmail: email,
        userInitials: initials,
        phone,
        bio,
        location,
        skills,
        education,
        experience,
        linkedin,
        github,
        portfolio,
      };
    }

    // ── RESUME ANALYSIS ─────────────────────────────────────────────────────
    case ACTIONS.SET_RESUME_ANALYZED: {

      const {
        file,
        source,
        role,
        experience,
        atsScore,
        skills,
        language,
        weakAreas,
        aiConfidence
      } = action.payload;

      const readiness = atsScore
        ? Math.round(
            atsScore * 0.5 +
            (state.mockScore ?? 0) * 0.25 +
            (state.codingScore ?? 0) * 0.25
          )
        : state.overallReadiness;

      return {
        ...state,
        resumeFile: file,
        resumeSource: source,
        resumeAnalyzed: true,
        predictedRole: role,
        experienceLevel: experience,
        atsScore,
        detectedSkills: skills,
        detectedLanguage: language,
        weakAreas,
        aiConfidence,
        overallReadiness: readiness,
      };
    }

    // ── MOCK INTERVIEW ──────────────────────────────────────────────────────
    case ACTIONS.COMPLETE_INTERVIEW: {

      const { score, duration } = action.payload;

      const newEntry = {
        type: 'Mock Interview',
        score,
        duration,
        date: new Date().toLocaleDateString()
      };

      const history = [newEntry, ...state.interviewHistory].slice(0, 10);

      const total = state.totalInterviews + 1;

      const allScores = history.map(h => h.score);

      const avg = Math.round(
        allScores.reduce((a, b) => a + b, 0) / allScores.length
      );

      const readiness = Math.round(
        (state.atsScore ?? 70) * 0.4 +
        score * 0.35 +
        (state.codingScore ?? 70) * 0.25
      );

      return {
        ...state,
        mockScore: score,
        interviewHistory: history,
        totalInterviews: total,
        averageScore: avg,
        overallReadiness: readiness,
      };
    }

    // ── CODING INTERVIEW ────────────────────────────────────────────────────
    case ACTIONS.COMPLETE_CODING: {

      const { score, duration } = action.payload;

      const newEntry = {
        type: 'Coding Round',
        score,
        duration,
        date: new Date().toLocaleDateString()
      };

      const history = [newEntry, ...state.interviewHistory].slice(0, 10);

      const total = state.totalInterviews + 1;

      const readiness = Math.round(
        (state.atsScore ?? 70) * 0.4 +
        (state.mockScore ?? 70) * 0.35 +
        score * 0.25
      );

      return {
        ...state,
        codingScore: score,
        interviewHistory: history,
        totalInterviews: total,
        overallReadiness: readiness,
      };
    }

    // ── HR INTERVIEW ────────────────────────────────────────────────────────
    case ACTIONS.COMPLETE_HR: {

      const { score, duration } = action.payload;

      const newEntry = {
        type: 'HR Round',
        score,
        duration,
        date: new Date().toLocaleDateString()
      };

      const history = [newEntry, ...state.interviewHistory].slice(0, 10);

      const total = state.totalInterviews + 1;

      return {
        ...state,
        hrScore: score,
        interviewHistory: history,
        totalInterviews: total,
      };
    }

    // ── TOASTS ──────────────────────────────────────────────────────────────
    case ACTIONS.ADD_TOAST: {

      const toast = {
        id: Date.now(),
        ...action.payload
      };

      return {
        ...state,
        toasts: [...state.toasts, toast]
      };
    }

    case ACTIONS.REMOVE_TOAST: {

      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload)
      };
    }

    // ── RESET RESUME ────────────────────────────────────────────────────────
    case ACTIONS.RESET_RESUME: {

      return {
        ...state,
        resumeFile: null,
        resumeSource: null,
        resumeAnalyzed: false,
        predictedRole: null,
        experienceLevel: null,
        atsScore: null,
        detectedSkills: [],
        detectedLanguage: null,
        weakAreas: [],
        aiConfidence: null,
      };
    }

    default:
      return state;
  }
};

// ── Context ───────────────────────────────────────────────────────────────────
export const AppContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {

  const [state, dispatch] = useReducer(appReducer, initialState);

  // Toast helper
  const toast = useCallback(
    (message, type = 'success', duration = 4000) => {

      const id = Date.now();

      dispatch({
        type: ACTIONS.ADD_TOAST,
        payload: { id, message, type }
      });

      setTimeout(() => {
        dispatch({
          type: ACTIONS.REMOVE_TOAST,
          payload: id
        });
      }, duration);

    },
    []
  );

  return (
    <AppContext.Provider value={{ state, dispatch, toast }}>
      {children}
    </AppContext.Provider>
  );
};

// ── Custom Hook ──────────────────────────────────────────────────────────────
export const useApp = () => {

  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }

  return ctx;
};