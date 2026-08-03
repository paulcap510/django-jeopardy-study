import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function AllEntries() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/entries/')
      .then(res => res.json())
      .then(data => setEntries(data));
  }, []);

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back</Link>
      <h1 className="entry-title">All Entries</h1>
      <ul className="entry-grid">
        {entries.map((entry, index) => (
          <li key={entry.id}>
            <Link
              to={`/entries/${entry.id}`}
              className="entry-tile"
              style={{ animationDelay: `${Math.min(index, 20) * 0.03}s` }}
            >
              {entry.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AllEntries