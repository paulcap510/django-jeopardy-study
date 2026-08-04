import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './EditEntry.css';

function GenerateEntry() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTitle = searchParams.get('name') || '';

  const [formData, setFormData] = useState({
    title: initialTitle,
    context: '',
    categories_text: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    fetch('http://127.0.0.1:8000/api/entries/generate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 201) {
          navigate(`/entries/${data.id}`);
        } else {
          setError(data.error || 'Something went wrong.');
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      });
  };

  return (
    <div className="page">
      <div className="entry-page-inner">
        <Link to="/" className="back-link">
          ← Back
        </Link>
        <h1 className="entry-title">Generate a new entry with AI</h1>

        {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="title">Topic</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="context">Context (optional)</label>
              <input
                type="text"
                id="context"
                name="context"
                value={formData.context}
                onChange={handleChange}
                placeholder="e.g. the TV show, not the city"
              />
            </div>

            <div className="form-field">
              <label htmlFor="categories_text">Categories</label>
              <input
                type="text"
                id="categories_text"
                name="categories_text"
                value={formData.categories_text}
                onChange={handleChange}
                placeholder="Comma-separated, e.g. Literature, Authors"
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GenerateEntry;
