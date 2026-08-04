import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchComponent from './SearchComponent';
import './Home.css';
import { API_URL } from '../api';

const ITEMS_PER_PAGE = 12;

function Home() {
  const [entries, setEntries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [entryPage, setEntryPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/entries/`).then((res) => res.json()),
      fetch(`${API_URL}/api/categories/`).then((res) => res.json()),
    ]).then(([entriesData, categoriesData]) => {
      setEntries(entriesData);
      setCategories(categoriesData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1 className="site-title">Jeopardy! Study</h1>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  const totalEntryPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  const entryStart = (entryPage - 1) * ITEMS_PER_PAGE;
  const visibleEntries = entries.slice(entryStart, entryStart + ITEMS_PER_PAGE);

  const totalCategoryPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const categoryStart = (categoryPage - 1) * ITEMS_PER_PAGE;
  const visibleCategories = categories.slice(
    categoryStart,
    categoryStart + ITEMS_PER_PAGE,
  );

  return (
    <div className="page">
      <h1 className="site-title">Jeopardy! Study</h1>
      <SearchComponent />

      <div className="add-entry-link">
        <Link to="/entries/add" className="btn">
          + Add New Entry
        </Link>
      </div>

      <h2 className="section-heading">Entries</h2>
      <ul className="entry-grid">
        {visibleEntries.map((entry, index) => (
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

      {totalEntryPages > 1 && (
        <div className="pagination">
          <button
            disabled={entryPage === 1}
            onClick={() => setEntryPage((p) => p - 1)}
          >
            &lt; Prev
          </button>
          <span>
            Page {entryPage} of {totalEntryPages}
          </span>
          <button
            disabled={entryPage === totalEntryPages}
            onClick={() => setEntryPage((p) => p + 1)}
          >
            Next &gt;
          </button>
        </div>
      )}

      <div className="browse-all">
        <Link to="/entries" className="btn">
          Browse All Entries
        </Link>
      </div>

      <h2 className="section-heading">Categories</h2>
      <ul className="entry-grid">
        {visibleCategories.map((category, index) => (
          <li key={category.id}>
            <Link
              to={`/categories/${category.id}`}
              className="entry-tile"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>

      {totalCategoryPages > 1 && (
        <div className="pagination">
          <button
            disabled={categoryPage === 1}
            onClick={() => setCategoryPage((p) => p - 1)}
          >
            &lt; Prev
          </button>
          <span>
            Page {categoryPage} of {totalCategoryPages}
          </span>
          <button
            disabled={categoryPage === totalCategoryPages}
            onClick={() => setCategoryPage((p) => p + 1)}
          >
            Next &gt;
          </button>
        </div>
      )}
      <div className="browse-all">
        <Link to="/categories" className="btn">
          Browse All Categories
        </Link>
      </div>
    </div>
  );
}

export default Home;
