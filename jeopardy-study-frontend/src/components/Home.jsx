import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/entries/')
      .then(res => res.json())
      .then(data => setEntries(data));
  }, []);

  return (
    <>
      <h1>Jeopardy Study</h1>
      <ul>
        {entries.map(entry => (
          <li key={entry.id}>
            <Link to={`/entries/${entry.id}`}>{entry.name}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Home