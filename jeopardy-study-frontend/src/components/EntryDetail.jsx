import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './EntryDetail.css';
import { API_URL } from '../api';

const CATEGORY_COLORS = [
  { bg: 'rgba(255, 204, 0, 0.12)', border: '#ffcc00', text: '#ffcc00' },
  { bg: 'rgba(29, 158, 117, 0.15)', border: '#5dcaa5', text: '#5dcaa5' },
  { bg: 'rgba(216, 90, 48, 0.15)', border: '#f0997b', text: '#f0997b' },
  { bg: 'rgba(212, 83, 126, 0.15)', border: '#ed93b1', text: '#ed93b1' },
  { bg: 'rgba(127, 119, 221, 0.15)', border: '#afa9ec', text: '#afa9ec' },
];

function colorForCategory(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[index];
}

function parseFacts(content) {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return null;
  }

  return lines.map((line) => line.replace(/^-\s*/, ''));
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function linkifyText(text, allEntries, currentId) {
  //!step 1 = remove current entry from consideration; filter by entry ID
  const others = allEntries.filter((e) => e.id !== currentId);
  if (others.length === 0) return text;

  const sorted = [...others].sort((a, b) => b.name.length - a.name.length);
  const pattern = new RegExp(
    `\\b(${sorted.map((e) => escapeRegex(e.name)).join('|')})\\b`,
    'gi',
  );

  //! 2 build lookup, so we can find an entry by its name (e.name); we build one big collection of lower case names
  //** e.g. = nameToEntry["nile river"] = { id: 4, name: "Nile River" } */
  const nameToEntry = {};
  others.forEach((e) => {
    nameToEntry[e.name.toLowerCase()] = e;
  });

  //!3 Regex scans text for any of the names we creted in step 2
  //**"Start of the Blue Nile (Nile River)" = we find "nile river" and break text into peices separating the name(e.name) part = e.g. only "Nile River" and before and after */
  const parts = text.split(pattern);

  //!4 Returns the name as a link. Decides whether to return the piece with or without a link. If there is a match with the name (e.name), we return it as a link
  return parts.map((part, index) => {
    const match = nameToEntry[part.toLowerCase()];
    if (match) {
      return (
        <Link key={index} to={`/entries/${match.id}`} className="wiki-link">
          {part}
        </Link>
      );
    }
    return part;
  });
}
function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [allEntries, setAllEntries] = useState([]);
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/entries/${id}/`)
      .then((res) => res.json())
      .then((data) => setEntry(data));
  }, [id]);
  useEffect(() => {
    fetch(`${API_URL}/api/entries/`)
      .then((res) => res.json())
      .then((data) => setAllEntries(data));
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm('Delete this entry?')) return;

    fetch(`${API_URL}/api/entries/${id}/delete/`, {
      method: 'DELETE',
    }).then(() => {
      navigate('/');
    });
  };

  useEffect(() => {
    const handleMouseUp = () => {
      const sel = window.getSelection();
      const text = sel.toString().trim();

      if (text.length > 0) {
        //! when selecting text with your mouse, your browser creates a 'range' object to determine where the selection starts and stops
        const range = sel.getRangeAt(0); //! (0) gets the current selection
        const rect = range.getBoundingClientRect();
        setSelection({
          text,
          top: window.scrollY + rect.top,
          left: window.scrollX + rect.left,
        });
      } else {
        setSelection(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp); // start listening for the mouse button release
    return () => document.removeEventListener('mouseup', handleMouseUp);
  });

  if (!entry) return <p>Loading...</p>;

  const facts = parseFacts(entry.content);

  return (
    <div className="page">
      <div className="entry-page-inner">
        <Link to="/" className="back-link">
          ← Back
        </Link>
        <h1 className="entry-title">{entry.name}</h1>

        {entry.categories.length > 0 && (
          <div className="entry-categories">
            {entry.categories.map((category) => {
              const color = colorForCategory(category.name);
              return (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}`}
                  className="category-tag"
                  style={{
                    background: color.bg,
                    borderColor: color.border,
                    color: color.text,
                  }}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        )}

        {facts ? (
          <ul className="fact-list">
            {facts.map((fact, index) => (
              <li
                key={index}
                className="fact-card"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                {linkifyText(fact, allEntries, entry.id)}
              </li>
            ))}
          </ul>
        ) : (
          <div className="clue-box">
            {linkifyText(entry.content, allEntries, entry.id)}
          </div>
        )}

        <div className="entry-actions">
          <Link to={`/entries/${id}/edit`} className="btn">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      {selection && (
        <div
          className="selection-buttons"
          style={{ top: selection.top - 50, left: selection.left }}
        >
          <button
            onClick={() =>
              navigate(
                `/entries/add?name=${encodeURIComponent(selection.text)}`,
              )
            }
          >
            + Add Entry
          </button>
          <button
            onClick={() =>
              navigate(`/generate?name=${encodeURIComponent(selection.text)}`)
            }
          >
            Generate with AI
          </button>
        </div>
      )}
    </div>
  );
}

export default EntryDetail;
