import { Link } from 'react-router-dom';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="page">
      <Link to="/" className="back-link">
        &larr; Back to entries
      </Link>

      <h1 className="entry-title">About</h1>

      <div className="about-content">
        <section>
          <p>
            Jeopardy Study is a personal trivia study wiki. Type in a topic, get
            a set of concise study facts, and browse them like index cards. It's
            built for moments like watching Jeopardy and not recognizing a
            clue's subject, or brushing up on a topic before trivia night.
          </p>
        </section>

        <section>
          <h2>What it does</h2>
          <ul>
            <li>Create, edit, and delete entries on any topic</li>
            <li>Organize entries into categories</li>
            <li>Search across entry names and content</li>
            <li>
              Automatic linking: mentioning an existing entry's name inside
              another entry turns it into a clickable link
            </li>
            <li>
              Select any text on an entry to quickly create a new entry from it
            </li>
            <li>
              AI-generated entries: type a topic and a set of study facts is
              generated automatically via the OpenRouter API
            </li>
          </ul>
        </section>

        <section>
          <h2>Built with</h2>
          <p>
            Django and Django REST Framework on the backend, with PostgreSQL
            hosted on Neon in production. The frontend is React, built with Vite
            and React Router, deployed separately from the backend. AI-generated
            content is powered by OpenRouter. Both halves are hosted on Render.
          </p>
        </section>

        <section>
          <h2>A note on this deployment</h2>
          <p>
            This is a personal, single-user tool at heart. Anyone can browse and
            search entries here, but write access, adding, editing, generating,
            or deleting, is restricted to the project owner through a
            backend-checked secret key rather than full user accounts. On this
            public deployment, those controls are visible but disabled for
            everyone but me.
          </p>
        </section>

        <section>
          <h2>Run it yourself</h2>
          <p>
            The project is open source. Clone the repository and follow the
            setup instructions in the README to run your own local copy against
            your own database.
          </p>
          <a
            href="https://github.com/paulcap510/django-jeopardy-study"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            View on GitHub
          </a>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
