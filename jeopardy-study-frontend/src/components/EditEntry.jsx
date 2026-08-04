import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './EditEntry.css';
import { API_URL, ADMIN_KEY } from '../api';

function EditEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [entry, setEntry] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    categories_text: '',
  });

  useEffect(() => {
    fetch(`${API_URL}/api/entries/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setEntry(data);
        setFormData({
          name: data.name,
          content: data.content,
          categories_text: data.categories.map((c) => c.name).join(', '),
        });
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    fetch(`${API_URL}/api/entries/${id}/edit/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 200) {
          navigate(`/entries/${data.id}`);
        } else {
          setError(data.error || 'Something went wrong.');
        }
      })
      .catch(() => {
        setError('Something went wrong. Please try again.');
      });
  };

  if (!entry) {
    return (
      <div className="page">
        <p style={{ textAlign: 'center' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="entry-page-inner">
        <Link to={`/entries/${id}`} className="back-link">
          ← Back
        </Link>
        <h1 className="entry-title">Edit entry</h1>
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

export default EditEntry;
