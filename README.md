# Jeopardy Study

A personal trivia study wiki built with Django and React. Browse, search, and edit fact entries on any topic, with AI-assisted entry generation and automatic linking between related topics.

**Live app:** https://django-jeopardy-study-frontend.onrender.com

## Features

- Create, edit, and delete entries on any topic
- Organize entries with categories
- Search across entry names and content
- Automatic linking: mentioning an existing entry's name in another entry's content turns it into a clickable link
- Select any text and quickly create a new entry from it
- AI-generated entries: type a topic and get a set of study facts generated automatically via OpenRouter
- Pagination and "browse all" views for entries and categories

## Tech stack

**Backend**

- Django + Django REST Framework
- PostgreSQL (via Neon) in production
- OpenRouter API for AI-generated content
- Deployed on Render (gunicorn + whitenoise)

**Frontend**

- React (Vite)
- React Router
- Deployed separately on Render as a static site

## Setup

### Backend

1. Clone the repo and create a virtual environment.

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies.

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the project root (see `.env.example`).

   ```
   OPENROUTER_API_KEY=your-key-here
   DATABASE_URL=your-postgres-connection-string
   SECRET_KEY=your-django-secret-key
   ADMIN_SECRET_KEY=your-admin-secret-key
   DEBUG=True
   ```

4. Run migrations.

   ```bash
   python manage.py migrate
   ```

5. Create a superuser (optional, for admin access).

   ```bash
   python manage.py createsuperuser
   ```

6. Start the server.
   ```bash
   python manage.py runserver
   ```
   Runs at `http://127.0.0.1:8000/`

### Frontend

1. From `jeopardy-study-frontend/`, install dependencies.

   ```bash
   npm install
   ```

2. Create a `.env` file.

   ```
   VITE_API_URL=http://127.0.0.1:8000
   VITE_ADMIN_KEY=same value as backend ADMIN_SECRET_KEY
   ```

3. Start the dev server.
   ```bash
   npm run dev
   ```
   Runs at `http://localhost:5173/`

Both the backend and frontend need to be running for the app to work locally.

### Running both servers together

Instead of starting the backend and frontend separately, you can use the included `start.sh` script from the project root:

```bash
./start.sh
```

This runs `python manage.py runserver` and `npm run dev` (from `jeopardy-study-frontend/`) together, and stops both when you press `Ctrl+C`.

The first time only, make it executable:

```bash
chmod +x start.sh
```

## Usage

- Adding, editing, generating, and deleting entries requires the admin key, so those actions only work when running with a matching `ADMIN_SECRET_KEY` / `VITE_ADMIN_KEY` pair. On the public deployment, those controls are visible but disabled for everyone else.
- Highlight any text on an entry's page to quickly add or generate a new entry from the selection.
- Browse by category, use pagination, or search to find entries.
- When writing content, put each fact on its own line. Entries with two or more lines automatically display as separate fact cards; single-paragraph entries display as one block.

## Scope

A personal, single-user tool for individual study. Anyone can browse and view entries. Write access is restricted to the project owner via a shared secret key checked on the backend, not full user accounts.

## Notes and limitations

- AI can make mistakes. Read over AI-generated entries and fact-check them.
- AI-generated entries may be ambiguous if a topic name is shared by multiple things (for example, "Springfield" could mean a US city or the fictional TV town from The Simpsons). Use a more specific name ("Springfield, IL") or the optional context field for better results.
- Category matching is case-insensitive but not typo-tolerant. Near-duplicate categories aren't automatically merged.
- An earlier server-rendered (Django template) version of the app exists in the codebase. Its write routes (add/edit/delete/generate) are disabled, since they predate the admin-key protection and can't easily use it. Only its read-only pages remain active.

## Database backups

`local_backup.json` (project root, gitignored) is a manual snapshot of the trivia data.

```bash
python manage.py dumpdata trivia --indent 2 > local_backup.json
```

To restore:

```bash
python manage.py loaddata local_backup.json
python manage.py sqlsequencereset trivia | python manage.py dbshell
```

Confirm which database `DATABASE_URL` points to before running destructive commands like `Entry.objects.all().delete()`.
