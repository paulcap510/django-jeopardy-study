import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">
        Jeopardy! Study
      </Link>
      <div className="navbar-links">
        <Link to="/entries/add">Add Entry</Link>
        <Link to="/generate">Generate</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/search">Search</Link>
      </div>
    </nav>
  );
}

export default Navbar;
