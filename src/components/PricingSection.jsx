import { Check } from 'lucide-react';
import './PricingSection.css';

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Perfect to try out the AI capabilities.',
    features: [
      '1 Mock Interview per month',
      'Basic Resume Analysis',
      'Standard Feedback',
      'Community Access'
    ],
    buttonText: 'Get Started',
    isPro: false
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    desc: 'Everything you need to secure that offer.',
    features: [
      '10 Mock Interviews per month',
      'Advanced Resume Intelligence',
      'Real-Time Coding Challenges',
      'Detailed Scorecards & Analytics',
      'Priority Support'
    ],
    buttonText: 'Upgrade to Pro',
    isPro: true
  },
  {
    name: 'Ultimate AI',
    price: '$99',
    period: '/lifetime',
    desc: 'Unlimited preparation for power users.',
    features: [
      'Unlimited Mock Interviews',
      'Panic Mode Preparation',
      '1-on-1 Human Expert Review',
      'Custom Domain Scenarios',
      '24/7 Dedicated Support'
    ],
    buttonText: 'Get Ultimate',
    isPro: false
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="pricing-section section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="section-subtitle">
            Invest in your future. Choose the plan that works for you.
          </p>
        </div>
        
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`pricing-card glass-panel ${plan.isPro ? 'pro-card' : ''}`}>
              {plan.isPro && <div className="pro-badge">Most Popular</div>}
              
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="amount">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                <p className="plan-desc">{plan.desc}</p>
              </div>
              
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <Check size={18} className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className={`btn w-full ${plan.isPro ? 'btn-primary' : 'btn-outline'}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
