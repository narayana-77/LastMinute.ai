import { X, Shield, FileText } from 'lucide-react';
import './TermsModal.css';

const TERMS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing and using LastMinute.ai, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.',
  },
  {
    title: '2. Service Description',
    body: 'LastMinute.ai provides AI-powered interview preparation tools including resume analysis, mock interviews, coding challenges, and behavioral training. The platform is for educational purposes only.',
  },
  {
    title: '3. User Accounts',
    body: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information during registration.',
  },
  {
    title: '4. Privacy Policy',
    body: 'We collect and process your data as described in our Privacy Policy. Your resume data and interview sessions are processed to provide personalized AI analysis. We do not sell your personal data to third parties.',
  },
  {
    title: '5. Intellectual Property',
    body: 'All content, features, and functionality of LastMinute.ai are owned by us and protected by copyright, trademark, and other intellectual property laws.',
  },
  {
    title: '6. Limitation of Liability',
    body: 'LastMinute.ai is provided "as is" without warranties of any kind. We are not responsible for outcomes of job interviews or hiring decisions. Our AI-generated content is for preparation purposes only.',
  },
  {
    title: '7. Termination',
    body: 'We reserve the right to terminate or suspend your account at any time for violations of these Terms. You may cancel your account at any time from your account settings.',
  },
];

const TermsModal = ({ onClose, onAccept }) => {
  return (
    <div className="terms-overlay" onClick={onClose}>
      <div className="terms-modal glass-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="terms-header">
          <div className="terms-title-row">
            <Shield size={22} className="text-cyan" />
            <h2>Terms of Service &amp; Privacy Policy</h2>
          </div>
          <button className="terms-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="terms-body">
          <div className="terms-intro">
            <FileText size={16} className="text-purple" />
            <p>Last updated: May 2026 — Please read these terms carefully before creating your account.</p>
          </div>

          {TERMS.map(section => (
            <div key={section.title} className="terms-section">
              <h4>{section.title}</h4>
              <p>{section.body}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="terms-footer">
          <button className="btn btn-outline" onClick={onClose}>Decline</button>
          <button className="btn btn-primary" onClick={onAccept}>
            <Shield size={16} /> I Accept These Terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
