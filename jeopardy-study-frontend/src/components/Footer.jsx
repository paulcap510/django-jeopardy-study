import { Link } from 'react-router-dom';
import { FiGithub, FiMail } from 'react-icons/fi';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <span className="footer-title">Jeopardy! Study</span>
        <a href="paulcapob@gmail.com" className="footer-email">
          <FiMail /> Email us
        </a>
      </div>

      <div className="footer-section footer-socials">
        <a
          href="https://github.com/paulcap510/django-jeopardy-study"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiGithub />
        </a>

        <a href="paulcapob@gmail.com">
          <FiMail />
        </a>
      </div>

      <div className="footer-section footer-links">
        <div className="footer-column">
          <Link to="/">Home</Link>
          <Link to="/entries">Entries</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/generate">Generate</Link>
        </div>
        <div className="footer-column">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/how-to-use">How to Use</Link>
          <Link to="/terms">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
