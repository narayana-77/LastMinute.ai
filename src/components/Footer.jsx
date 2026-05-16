import { BrainCircuit, Globe, Mail, Link, Disc as Discord } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer section">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <BrainCircuit className="logo-icon" size={28} />
              <span className="logo-text">LastMinute<span className="accent">.ai</span></span>
            </div>
            <p className="footer-desc">
              The AI-powered interview preparation platform that helps you secure offers faster, smarter, and with absolute confidence.
            </p>
            <div className="social-links">
              <a href="#" className="social-link"><Globe size={20} /></a>
              <a href="#" className="social-link"><Mail size={20} /></a>
              <a href="#" className="social-link"><Link size={20} /></a>
              <a href="#" className="social-link"><Discord size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Platform</h4>
              <ul>
                <li><a href="#">AI Mock Interviews</a></li>
                <li><a href="#">Coding Simulator</a></li>
                <li><a href="#">Resume Parsing</a></li>
                <li><a href="#">Pricing</a></li>
              </ul>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Interview Guides</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Question Bank</a></li>
                <li><a href="#">Community</a></li>
              </ul>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LastMinute AI. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <span className="dot"></span>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
