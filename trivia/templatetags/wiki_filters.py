import re
from django import template
from django.utils.html import escape
from django.utils.safestring import mark_safe
from django.urls import reverse
from trivia.models import Entry

register = template.Library()


@register.filter #registers the function specifically so it can be used inside templates, with the | syntax ({{ entry.content|render_links }})
def render_links(content):
    safe_content = escape(content) #escape makes sure the browser does not treat the text as HTML
    entries = Entry.objects.all()

    for entry in entries:
        #! Looks for a pattern matching an entry in the safe_content
        pattern = re.compile(r'\b' + re.escape(entry.name) + r'\b', re.IGNORECASE)         #re.escape regex pattern to ensure search matches; re.compile = compiles into usable regex
        url = reverse('entry_detail', args=[entry.id])
        link = f'<a class="wiki-link" href="{url}">{escape(entry.name)}</a>'
        safe_content = pattern.sub(link, safe_content, count=1)

    return mark_safe(safe_content) # the result is safe to render as real HTML now
