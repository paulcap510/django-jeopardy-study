import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SearchComponent from './SearchComponent'
import './Home.css'

function Home() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/entries/')
      .then(res => res.json())
      .then(data => setEntries(data));
  }, []);

  return (
    <div className="page">
      <h1 className="site-title">Jeopardy! Study</h1>
      <SearchComponent />
      <ul className="entry-grid">
        {entries.map((entry, index) => (
          <li key={entry.id}>
            <Link
              to={`/entries/${entry.id}`}
              className="entry-tile"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {entry.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home