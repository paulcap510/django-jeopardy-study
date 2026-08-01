import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Content
        <textarea name="content" value={formData.content} onChange={handleChange} />
      </label>
      <label>
        Categories
        <input type="text" name="categories_text" value={formData.categories_text} onChange={handleChange} />
      </label>
      <button type="submit">Save</button>
    </form>
  )
}

export default EditEntry