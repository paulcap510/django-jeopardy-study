import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import './EditEntry.css'

function EditEntry() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    categories_text: ''
  });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/entries/${id}/`)
      .then(res => res.json())
      .then(data => {
        setEntry(data);
        setFormData({
          name: data.name,
          content: data.content,
          categories_text: data.categories.map(c => c.name).join(', ')
        });
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://127.0.0.1:8000/api/entries/${id}/edit/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        navigate(`/entries/${data.id}`);
      });
  }

  if (!entry) return <p>Loading...</p>;

  return (
    <div className="page">
      <div className="entry-page-inner">
        <Link to={`/entries/${id}`} className="back-link">← Back</Link>
        <h1 className="entry-title">Edit entry</h1>

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

            <button type="submit" className="btn">Save</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditEntry