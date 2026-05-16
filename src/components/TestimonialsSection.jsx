import { Star } from 'lucide-react';
import './TestimonialsSection.css';

const testimonials = [
  {
    name: 'Sarah J.',
    role: 'Frontend Developer @ TechCorp',
    content: 'LastMinute literally saved my interview. I had 24 hours to prepare, and the AI accurately predicted 4 out of the 5 questions I was asked. The feedback on my tone was invaluable.',
    rating: 5
  },
  {
    name: 'David M.',
    role: 'Product Manager @ Innovate',
    content: 'The HR behavioral trainer is mind-blowing. It helped me structure my STAR method answers perfectly. I went into the interview feeling more confident than ever.',
    rating: 5
  },
  {
    name: 'Emily C.',
    role: 'Full Stack Engineer',
    content: 'The live coding simulation feels just like the real thing. The AI pair programmer catching my edge case bugs before I submitted my final answer was a huge confidence booster.',
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">
            Don't Just Take <span className="gradient-text">Our Word</span>
          </h2>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((test, index) => (
            <div key={index} className="testimonial-card glass-panel">
              <div className="stars">
                {[...Array(test.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--accent-cyan)" color="var(--accent-cyan)" />
                ))}
              </div>
              <p className="testimonial-content">"{test.content}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {test.name.charAt(0)}
                </div>
                <div className="author-info">
                  <h4>{test.name}</h4>
                  <p>{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
