import { useState } from 'react'
import { Link } from 'react-router-dom'

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://127.0.0.1:8000/api/search/?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => setResults(data));
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={handleChange} placeholder="Search..." />
        <button type="submit">Search</button>
      </form>

      <ul>
        {results.map(entry => (
          <li key={entry.id}>
            <Link to={`/entries/${entry.id}`}>{entry.name}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default SearchComponent