# Jeopardy Study

A personal trivia study wiki built with Django. Browse, search, and edit fact entries on any topic, with AI-assisted entry generation and automatic linking between related topics.

## Features

- Create, edit, and delete entries on any topic
- Organize entries with categories
- Search across entry names and content
- Automatic linking: mentioning an existing entry's name in another entry's content turns it into a clickable link
- Select any text and quickly create a new entry from it
- AI-generated entries: type a topic and get a set of study facts generated automatically via OpenRouter

## Tech stack

- Django
- SQLite (development)
- OpenRouter API for AI-generated content

## Setup

1. Clone the repo and create a virtual environment:
```bash
   python3 -m venv venv
   source venv/bin/activate
```

2. Install dependencies:
```bash
   pip install -r requirements.txt
```

3. Create a `.env` file in the project root (see `.env.example`) and add your OpenRouter API key:

```
OPENROUTER_API_KEY=your-key-here
```

4. Run migrations:
```bash
   python manage.py migrate
```

5. Create a superuser (optional, for admin access):
```bash
   python manage.py createsuperuser
```

6. Start the server:
```bash
   python manage.py runserver
```

7. Visit `http://127.0.0.1:8000/`

## Usage

- Add entries manually through the "Add Entry" form, or generate one automatically from a title using the "Generate" page.
- Highlight any text on an entry's page to quickly create a new entry from it.
- Browse by category or use the search bar to find entries.