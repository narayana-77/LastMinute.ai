import { Upload, Cpu, CheckCircle, TrendingUp } from 'lucide-react';
import './HowItWorksSection.css';

const steps = [
  {
    icon: <Upload size={32} />,
    title: 'Upload Resume',
    desc: 'Provide your resume, portfolio link, or LinkedIn profile. We extract your core skills and domain.',
    step: '01'
  },
  {
    icon: <Cpu size={32} />,
    title: 'AI Analysis',
    desc: 'Our engine maps out the most likely interview questions for your specific tech stack and role level.',
    step: '02'
  },
  {
    icon: <CheckCircle size={32} />,
    title: 'Practice & Feedback',
    desc: 'Take the mock interview. Get instant feedback on your tone, accuracy, and code efficiency.',
    step: '03'
  },
  {
    icon: <TrendingUp size={32} />,
    title: 'Improve Confidence',
    desc: 'Review your weak spots, re-take specific questions, and walk into the real interview with confidence.',
    step: '04'
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="hiw-section section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">
            How It <span className="gradient-text">Works</span>
          </h2>
        </div>
        
        <div className="steps-container">
          <div className="steps-line"></div>
          {steps.map((step, index) => (
            <div key={index} className="step-card glass-panel">
              <div className="step-number">{step.step}</div>
              <div className="step-icon">
                {step.icon}
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
