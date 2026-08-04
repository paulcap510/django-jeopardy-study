import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="page not-found-page">
      <div className="entry-page-inner">
        <h1 className="entry-title">404 — Page not found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
