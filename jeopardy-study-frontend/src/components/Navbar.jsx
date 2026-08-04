import { Link } from 'react-router-dom';
import './Navbar.css';
import { isAdmin } from '../api';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">
        Jeopardy! Study
      </Link>
      <div className="navbar-links">
        <Link
          to={isAdmin ? '/entries/add' : '#'}
          onClick={(e) => {
            if (!isAdmin) e.preventDefault();
          }}
          title={!isAdmin ? 'Authorized users only' : ''}
          className={!isAdmin ? 'nav-link-disabled' : ''}
        >
          Add Entry
        </Link>
        <Link
          to={isAdmin ? '/generate' : '#'}
          onClick={(e) => {
            if (!isAdmin) e.preventDefault();
          }}
          title={!isAdmin ? 'Authorized users only' : ''}
          className={!isAdmin ? 'nav-link-disabled' : ''}
        >
          Generate
        </Link>{' '}
        <Link to="/categories">Categories</Link>
        <Link to="/search">Search</Link>
      </div>
    </nav>
  );
}

export default Navbar;
