from django.shortcuts import render, get_object_or_404, redirect
from .models import Entry, Category
from .forms import EntryForm
from django.db.models import Q
import requests
from django.conf import settings

def home(request):
    entries = Entry.objects.all().order_by('-created_at')
    categories = Category.objects.all()
    return render(request, 'trivia/home.html', {'entries': entries, 'categories': categories})

def category_entries(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    entries = category.entries.all()
    return render(request, 'trivia/category_entries.html', {'category': category, 'entries': entries})

def entry_detail(request, entry_id):
    entry = get_object_or_404(Entry, id=entry_id)
    return render(request, 'trivia/entry_detail.html', {'entry': entry})

def delete_entry(request, entry_id):
    entry = get_object_or_404(Entry, id=entry_id)
    if request.method == 'POST':
        entry.delete()

        return redirect('/?deleted=1')
    return redirect('home')



def edit_entry(request, entry_id):
    entry = get_object_or_404(Entry, id=entry_id)
    if request.method == 'POST':
        form = EntryForm(request.POST, instance=entry)
        if form.is_valid():
            entry = form.save()
            entry.categories.clear()
            for raw_name in form.cleaned_data['categories_text'].split(','):
                name = raw_name.strip()
                if name:
                    category, _ = Category.objects.get_or_create(name=name)
                    entry.categories.add(category)
            return redirect('entry_detail', entry_id=entry.id)
    else:
        existing_names = ', '.join(c.name for c in entry.categories.all())
        form = EntryForm(instance=entry, initial={'categories_text': existing_names})
    return render(request, 'trivia/edit_entry.html', {'form': form, 'entry': entry})


def add_entry(request):
    if request.method == 'POST':
        form = EntryForm(request.POST)
        if form.is_valid():
            entry = form.save()
            names = form.cleaned_data['categories_text'].split(',')
            for raw_name in names:
                name = raw_name.strip()
                if not name:
                    continue
                category = Category.objects.filter(name__iexact=name).first()
                if not category:
                    category = Category.objects.create(name=name)
                entry.categories.add(category)
            return redirect('entry_detail', entry_id=entry.id)
    else:
        initial_name = request.GET.get('name', '')
        form = EntryForm(initial={'name': initial_name})
    return render(request, 'trivia/add_entry.html', {'form': form})


from django.db.models import Q

def search_results(request):
    query = request.GET.get('q', '')
    if query:
        entries = Entry.objects.filter(
            Q(name__icontains=query) | Q(content__icontains=query)
        )
    else:
        entries = Entry.objects.none()
    return render(request, 'trivia/search_results.html', {'entries': entries, 'query': query})



def generate_entry(request):
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        categories_text = request.POST.get('categories_text', '')
        if title:
            try:
                response = requests.post(
                    url="https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    },
                    json={
                        "model": "openrouter/free",
                        "messages": [
                            {"role": "user", "content": f"Write 5-7 short factual bullet points about '{title}' suitable for trivia study. Return only the bullet points, one per line, starting each with a dash. No introduction or conclusion."}
                        ]
                    },
                    timeout=30,
                )
                response.raise_for_status()
                data = response.json()
                content = data['choices'][0]['message']['content']
            except (requests.RequestException, KeyError, IndexError):
                return render(request, 'trivia/generate_entry.html', {
                    'error': 'Something went wrong generating this entry. Please try again.',
                    'title': title,
                })

            entry = Entry.objects.create(name=title, content=content)
            for raw_name in categories_text.split(','):
                name = raw_name.strip()
                if name:
                    category, _ = Category.objects.get_or_create(name=name)
                    entry.categories.add(category)
            return redirect('entry_detail', entry_id=entry.id)

    return render(request, 'trivia/generate_entry.html')