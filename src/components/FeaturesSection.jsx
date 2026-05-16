import { Video, Code2, Users, FileText, Zap, ShieldAlert } from 'lucide-react';
import './FeaturesSection.css';

const features = [
  {
    icon: <Video size={28} className="feature-icon cyan" />,
    title: 'AI Mock Interviews',
    description: 'Realistic face-to-face video interviews with our conversational AI agent tailored to your domain.',
  },
  {
    icon: <Code2 size={28} className="feature-icon purple" />,
    title: 'Real-Time Coding',
    description: 'Live collaborative code editor with AI pair programmer observing and analyzing your approach.',
  },
  {
    icon: <Users size={28} className="feature-icon pink" />,
    title: 'HR Interview Trainer',
    description: 'Behavioral question simulation to help you answer tricky cultural and situational questions.',
  },
  {
    icon: <FileText size={28} className="feature-icon cyan" />,
    title: 'Resume Intelligence',
    description: 'Deep parsing of your resume to automatically generate questions based on your stated experience.',
  },
  {
    icon: <Zap size={28} className="feature-icon purple" />,
    title: 'Instant Feedback',
    description: 'Get actionable insights, detailed scoring, and improved answer suggestions immediately after.',
  },
  {
    icon: <ShieldAlert size={28} className="feature-icon pink" />,
    title: 'Panic Mode Prep',
    description: 'Interview in 2 hours? Use our ultra-condensed crash course to cover the most critical topics fast.',
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="features-section section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">
            The Ultimate <span className="gradient-text">Preparation Engine</span>
          </h2>
          <p className="section-subtitle">
            Our platform provides everything you need to build confidence and ace your next tech interview.
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card glass-panel">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
              <div className="feature-hover-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
