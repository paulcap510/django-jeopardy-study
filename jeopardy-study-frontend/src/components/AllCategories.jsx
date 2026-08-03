import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function AllCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back</Link>
      <h1 className="entry-title">All Categories</h1>
      <ul className="entry-grid">
        {categories.map((category, index) => (
          <li key={category.id}>
            <Link
              to={`/categories/${category.id}`}
              className="entry-tile"
              style={{ animationDelay: `${Math.min(index, 20) * 0.03}s` }}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AllCategories