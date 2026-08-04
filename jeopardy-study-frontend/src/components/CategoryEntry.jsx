import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CategoryEntry.css';
import { API_URL } from '../api';

function CategoryEntry() {
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/categories/`)
      .then((res) => res.json())
      .then((data) => {
        const match = data.find((cat) => cat.id === Number(id));
        setCategoryName(match ? match.name : 'Category');
      });

    fetch(`${API_URL}/api/categories/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  // if (loading) return <p>Loading...</p>;

  return (
    <div className="page">
      <Link to="/" className="back-link">
        ← Back
      </Link>
      <h1 className="entry-title">{categoryName}</h1>

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
  );
}

export default CategoryEntry;
