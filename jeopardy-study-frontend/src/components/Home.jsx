import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SearchComponent from './SearchComponent'
import './Home.css'

function Home() {
  const [entries, setEntries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/entries/')
      .then(res => res.json())
      .then(data => setEntries(data));

    fetch('http://127.0.0.1:8000/api/categories/')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <div className="page">
      <h1 className="site-title">Jeopardy! Study</h1>
      <SearchComponent />

      <h2 className="section-heading">Entries</h2>
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

      <h2 className="section-heading">Categories</h2>
      <ul className="entry-grid">
        {categories.map((category, index) => (
          <li key={category.id}>
            <Link
              to={`/categories/${category.id}`}
              className="entry-tile category-tile"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home