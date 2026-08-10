#!/usr/bin/env zsh

trap 'kill $(jobs -p) 2>/dev/null' EXIT

python manage.py runserver &
(cd jeopardy-study-frontend && npm run dev) &

wait