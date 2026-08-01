import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddEntry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    categories_text: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://127.0.0.1:8000/api/entries/add/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        navigate(`/entries/${data.id}`);
      });
  }

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

export default AddEntry;