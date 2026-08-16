#!/usr/bin/env zsh
lsof -ti :8000 | xargs kill -9 2>/dev/null

trap 'kill -- -$$' EXIT

python manage.py runserver --noreload &
(cd jeopardy-study-frontend && npm run dev) &

wait