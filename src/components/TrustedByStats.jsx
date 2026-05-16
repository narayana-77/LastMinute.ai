import './TrustedByStats.css';

const TrustedByStats = () => {
  return (
    <div className="trusted-section section">
      <div className="container">
        <p className="trusted-text text-center">TRUSTED BY CANDIDATES HIRED AT</p>
        <div className="logos-grid">
          {/* We will just use stylized text to represent company logos for the demo */}
          <div className="company-logo">Google</div>
          <div className="company-logo">Meta</div>
          <div className="company-logo">Amazon</div>
          <div className="company-logo">Netflix</div>
          <div className="company-logo">Apple</div>
          <div className="company-logo">Microsoft</div>
        </div>
      </div>
    </div>
  );
};

export default TrustedByStats;
