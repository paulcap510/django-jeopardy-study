import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AddEntry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    categories_text: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://127.0.0.1:8000/api/entries/add/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        navigate(`/entries/${data.id}`);
      });
  };

  return (
    <div className="page">
      <div className="entry-page-inner">
        <Link to="/" className="back-link">
          ← Back
        </Link>
        <h1 className="entry-title">Add a new entry</h1>

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
