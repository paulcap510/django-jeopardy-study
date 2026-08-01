import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function GenerateEntry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    context: '',
    categories_text: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    fetch('http://127.0.0.1:8000/api/entries/generate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => res.json().then(data => ({ status: res.status, data })))
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
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label>
        Topic
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </label>
      <label>
        Context (optional)
        <input type="text" name="context" value={formData.context} onChange={handleChange} />
      </label>
      <label>
        Categories
        <input type="text" name="categories_text" value={formData.categories_text} onChange={handleChange} />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
    </form>
  )
}

export default GenerateEntry