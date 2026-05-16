import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './FaqSection.css';

const faqs = [
  {
    question: 'How does the AI analyze my resume?',
    answer: 'Our engine uses NLP to extract your skills, experience levels, and domain context. It cross-references this with millions of real interview data points to generate hyper-relevant questions.'
  },
  {
    question: 'Is the interview real-time video?',
    answer: 'Yes! The AI agent speaks to you in real-time, pauses for your answer, and responds dynamically based on what you say. It is the closest simulation to a real human interview.'
  },
  {
    question: 'Can I use this for non-technical roles?',
    answer: 'Absolutely. While our coding module is designed for engineers, the behavioral and domain-specific modules support product managers, designers, marketers, and HR roles.'
  },
  {
    question: 'What happens in Panic Mode?',
    answer: 'Panic Mode generates a rapid-fire 30-minute session focusing purely on the absolute most common high-signal questions for your specific role, skipping the pleasantries to maximize your last-minute prep.'
  }
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-section section">
      <div className="container faq-container">
        <div className="faq-header text-center">
          <h2 className="section-title">Got <span className="gradient-text">Questions?</span></h2>
        </div>
        
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item glass-panel ${openIndex === index ? 'active' : ''}`}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                {openIndex === index ? <ChevronUp size={20} className="faq-icon" /> : <ChevronDown size={20} className="faq-icon" />}
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
