import { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, Zap } from 'lucide-react';
import { useApp, ACTIONS } from '../context/AppContext';
import './Toast.css';

const ICONS = {
  success: <CheckCircle2 size={18} />,
  error:   <AlertTriangle size={18} />,
  info:    <Info size={18} />,
  ai:      <Zap size={18} />,
};

const Toast = ({ id, message, type }) => {
  const { dispatch } = useApp();

  const dismiss = () => dispatch({ type: ACTIONS.REMOVE_TOAST, payload: id });

  return (
    <div className={`toast-item toast-${type} fade-in`} role="alert">
      <span className="toast-icon">{ICONS[type] ?? ICONS.info}</span>
      <p className="toast-msg">{message}</p>
      <button className="toast-close" onClick={dismiss} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { state } = useApp();
  if (!state.toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {state.toasts.map(t => (
        <Toast key={t.id} {...t} />
      ))}
    </div>
  );
};

export default ToastContainer;
