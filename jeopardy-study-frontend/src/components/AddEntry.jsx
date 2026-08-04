import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import './EditEntry.css';
import { API_URL, ADMIN_KEY } from '../api';

function AddEntry() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialName = searchParams.get('name') || '';

  const [formData, setFormData] = useState({
    name: initialName,
    content: '',
    categories_text: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    fetch(`${API_URL}/api/entries/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': ADMIN_KEY,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 201) {
          navigate(`/entries/${data.id}`);
        } else {
          setError(data.error || 'Something went wrong.');
        }
      })
      .catch(() => {
        setError('Something went wrong. Please try again.');
      });
  };

  return (
    <div className="page">
      <div className="entry-page-inner">
        <Link to="/" className="back-link">
          ← Back
        </Link>
        <h1 className="entry-title">Add a new entry</h1>
        {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write each fact on its own line. Each fact display as separate cards. A single paragraph with no line breaks will display as one block instead."
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

            <button type="submit" className="btn">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEntry;
