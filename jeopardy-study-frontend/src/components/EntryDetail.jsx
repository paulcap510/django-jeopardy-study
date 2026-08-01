import { useState, useEffect } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'

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
        .then(()=>{
            navigate('/')
        });
    }


  if (!entry) return <p>Loading...</p>;

  return (
    <>
      <Link to="/">← Back</Link>
      <h1>{entry.name}</h1>
      <p>{entry.content}</p>
    <Link to={`/entries/${id}/edit`}>Edit</Link>
          <button onClick={handleDelete}>Delete</button>
    </>
  )
}

export default EntryDetail