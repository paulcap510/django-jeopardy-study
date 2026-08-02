import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import './EntryDetail.css'

const CATEGORY_COLORS = [
  { bg: 'rgba(255, 204, 0, 0.12)', border: '#ffcc00', text: '#ffcc00' },
  { bg: 'rgba(29, 158, 117, 0.15)', border: '#5dcaa5', text: '#5dcaa5' },
  { bg: 'rgba(216, 90, 48, 0.15)', border: '#f0997b', text: '#f0997b' },
  { bg: 'rgba(212, 83, 126, 0.15)', border: '#ed93b1', text: '#ed93b1' },
  { bg: 'rgba(127, 119, 221, 0.15)', border: '#afa9ec', text: '#afa9ec' },
]

function colorForCategory(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[index];
}

function parseFacts(content) {
  const lines = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length < 2) {
    return null;
  }

  return lines.map(line => line.replace(/^-\s*/, ''));
}

function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/entries/${id}/`)
      .then(res => res.json())
      .then(data => setEntry(data));
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm('Delete this entry?')) return;

    fetch(`http://127.0.0.1:8000/api/entries/${id}/delete/`, {
      method: 'DELETE',
    })
      .then(() => {
        navigate('/')
      });
  }

  if (!entry) return <p>Loading...</p>;

  const facts = parseFacts(entry.content);

  return (
    <div className="page">
      <div className="entry-page-inner">
        <Link to="/" className="back-link">← Back</Link>
        <h1 className="entry-title">{entry.name}</h1>

        {entry.categories.length > 0 && (
  <div className="entry-categories">
    {entry.categories.map(category => {
      const color = colorForCategory(category.name);
      return (
        <Link
          key={category.id}
          to={`/categories/${category.id}`}
          className="category-tag"
          style={{
            background: color.bg,
            borderColor: color.border,
            color: color.text,
          }}
        >
          {category.name}
        </Link>
      );
    })}
  </div>
)}


        {facts ? (
          <ul className="fact-list">
            {facts.map((fact, index) => (
              <li
                key={index}
                className="fact-card"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                {fact}
              </li>
            ))}
          </ul>
        ) : (
          <div className="clue-box">{entry.content}</div>
        )}

        <div className="entry-actions">
          <Link to={`/entries/${id}/edit`} className="btn">Edit</Link>
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default EntryDetail