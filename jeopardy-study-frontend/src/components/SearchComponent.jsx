import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SearchComponent.css';
import { API_URL } from '../api';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'empty'

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    setSubmittedQuery(query);

    fetch(`${API_URL}/api/search/?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setStatus(data.length > 0 ? 'success' : 'empty');
      });
  };

  return (
    <>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>

      {status === 'loading' && <p className="search-status">Searching...</p>}

      {status === 'success' && (
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

      {status === 'empty' && (
        <section className="search-results">
          <p className="no-results">No results found for "{submittedQuery}".</p>
        </section>
      )}
    </>
  );
}

export default SearchComponent;
