import { useState } from 'react'
import { Link } from 'react-router-dom'
import './SearchComponent.css'
import { API_URL } from '../api';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/api/search/?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => setResults(data));
  }

  return (
    <>
      <form className="search-form" onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={handleChange} placeholder="Search..." />
        <button type="submit">Search</button>
      </form>


      {results.length > 0 && (
  <section className="search-results">
    <h2 className="search-results-heading">Search results</h2>
    <ul className="entry-grid">
      {results.map((entry, index) => (
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
  </section>
)}


    </>
  )
}

export default SearchComponent